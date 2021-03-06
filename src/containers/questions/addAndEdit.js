import React, { useEffect, useRef, useState } from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
} from 'reactstrap'
import axios from 'helpers/axios'
import { Form, Typography, Select, Alert, Spin, Input } from 'antd'
import momentTime from 'helpers/moment'
import useFormInput from 'helpers/useFormInput'
import useFormSelect from 'helpers/useFormSelect'
import { errorMessage, successMessage } from 'helpers/globalMessage'
import {
  BooleanChoice,
  MergingQuestion,
  MissingWords,
  SingleChoice,
  MultipleChoice,
} from 'components/questions'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ImageResize from 'quill-image-resize-module-react'
Quill.register('modules/imageResize', ImageResize)

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
      { align: [] },
    ],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ direction: 'rtl' }], // text direction,

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme

    ['link', 'image'],

    ['clean'], // remove formatting button
  ],
  imageResize: {
    modules: ['Resize', 'DisplaySize'],
  },
}

const layout = {
  labelCol: {
    sm: { span: 5 },
  },
}

const AddNewModal = ({
  modalOpen,
  toggleModal,
  editId,
  addNewFlag,
  addNew,
  editData,
}) => {
  const alias = useFormInput()
  const content = useFormInput()
  const created_at = useFormInput()
  const type = useFormSelect(0)
  const choiceRef = useRef()
  const [loading, setLoading] = useState(false)
  const [choices, setChoices] = useState(null)
  const [booleanChoices, setBooleanChoices] = useState(null)

  useEffect(() => {
    const fetch = () => {
      if (!addNewFlag && editId) {
        setLoading(true)
        axios
          .get('admin/questions/get-info/' + editId)
          .then((res) => {
            return res.data
          })
          .then((data) => {
            if (data.status === 200) {
              alias.setValue(data.data.alias)
              content.setValue(data.data.content)
              type.setValue(data.data.type)
              created_at.setValue(data.data.created_at)
              if (data.data.type === 1) {
                setChoices(data.data.choices)
              } else if (data.data.type === 2) {
                setBooleanChoices(data.data.choices)
              }
            }
          })
          .finally(() => setLoading(false))
      } else {
        alias.setValue(null)
        content.setValue(null)
        type.setValue(0)
      }
    }

    fetch()
  }, [editId, addNewFlag]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = () => {
    setLoading(true)
    const choicePackage =
      type.value === 1 ? choices : type.value === 2 ? booleanChoices : null

    const params = {
      alias: alias.value,
      content: content.value,
      type: parseInt(type.value),
      choicePackage,
    }

    if (!addNewFlag && editId) {
      axios
        .post('admin/questions/update', { id: editId, ...params })
        .then((res) => {
          if (res.data.status === 200) {
            successMessage('C???p nh???t c??u h???i th??nh c??ng')
            editData({ id: editId, ...params })
          } else {
            errorMessage('C???p nh???t c??u h???i th???t b???i')
          }
        })
        .finally(() => {
          setLoading(false)
          toggleModal()
        })
    } else {
      axios
        .post('admin/questions/create', params)
        .then((res) => {
          if (res.data.status === 200) {
            successMessage('T???o c??u h???i th??nh c??ng')
            addNew({
              id: res.data.data,
              created_at: null,
              ...params,
            })
          } else {
            errorMessage('T???o c??u h???i th???t b???i')
          }
        })
        .finally(() => {
          setLoading(false)
          toggleModal()
        })
    }
  }

  const generateQuestionType = (_type) => {
    switch (_type) {
      case 1:
        return (
          <SingleChoice
            choices={choices}
            setChoices={setChoices}
            title="Tr???c nghi???m m???t l???a ch???n"
          />
        )
      case 2:
        return (
          <BooleanChoice
            choices={booleanChoices}
            setChoices={setBooleanChoices}
            title="Tr???c nghi???m ????ng sai"
          />
        )
      case 3:
        return <MergingQuestion ref={choiceRef} title="N???i c??u" />
      case 4:
        return <MissingWords ref={choiceRef} title="??i???n khuy???t" />
      case 5:
        return (
          <MultipleChoice ref={choiceRef} title="Tr???c nghi???m nhi???u l???a ch???n" />
        )
      default:
        return 'C??u h???i t??? lu???n'
    }
  }

  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
      style={{ maxWidth: '700px' }}
    >
      <ModalHeader toggle={toggleModal}>
        {!addNewFlag && editId
          ? 'Thay ?????i n???i dung c??u h???i'
          : 'T???o m???i c??u h???i'}
      </ModalHeader>
      <Spin spinning={loading} size="large">
        <ModalBody>
          <Card>
            <CardBody>
              <Form {...layout} layout="horizontal" size="medium">
                {type.value === 4 && (
                  <Form.Item>
                    <Alert message={<>L??u ??: (...)</>} type="info" showIcon />
                  </Form.Item>
                )}
                <Form.Item label="T??n g???i nh??? (alias)">
                  <Input allowClear {...alias} />
                </Form.Item>
                <Form.Item label="N???i dung c??u h???i">
                  <ReactQuill modules={modules} theme="snow" {...content} />
                </Form.Item>
                <Form.Item label="Ch???n lo???i c??u h???i">
                  <Select {...type}>
                    <Select.Option value={0}>T??? lu???n</Select.Option>
                    <Select.Option value={1}>
                      Tr???c nghi???m m???t l???a ch???n
                    </Select.Option>
                    {/* <Select.Option value={5}>Tr???c nghi???m nhi???u l???a ch???n</Select.Option> */}
                    <Select.Option value={2}>
                      Tr???c nghi???m ????ng sai
                    </Select.Option>
                    {/* <Select.Option value={3}>N???i c??u</Select.Option>
              <Select.Option value={4}>??i???n khuy???t</Select.Option> */}
                  </Select>
                </Form.Item>
              </Form>
              <Card>
                <CardBody>{generateQuestionType(type.value)}</CardBody>
              </Card>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Typography.Text code>
            Ng??y t???o: {momentTime(created_at.value || null)}
          </Typography.Text>
          <Button color="secondary" outline onClick={toggleModal}>
            H???y
          </Button>
          <Button color="primary" onClick={onSubmit}>
            C???p nh???t
          </Button>
        </ModalFooter>
      </Spin>
    </Modal>
  )
}

export default React.memo(AddNewModal)
