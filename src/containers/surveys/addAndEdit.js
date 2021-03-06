import React, { useState, useEffect } from 'react'
import IntlMessages from 'helpers/IntlMessages'
import { Drawer, Spin } from 'antd'
import { Button } from 'reactstrap'
import Steps from './steps'
import useFormInput from 'helpers/useFormInput'
import axios from 'helpers/axios'
import moment from 'moment'
import { successMessage, errorMessage } from 'helpers/globalMessage'
import createSlug from 'helpers/createSlug'
import ExportToExcel from './ExportToExcel'

const AddAndEdit = ({
  modalOpen,
  toggleModal,
  editId,
  addNewFlag,
  editData,
  addNew,
}) => {
  const title = useFormInput()
  const slug = useFormInput()
  const description = useFormInput()
  const [initQuestions, setInitQuestions] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('1')
  const [data, setData] = React.useState([])
  const fileName = 'myfile'

  const customers = [
    {
      userId: 1,
      id: 1,
      title:
        'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body:
        'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
    },
  ]

  useEffect(() => {
    const fetch = async () => {
      if (!addNewFlag && editId) {
        setLoading(true)
        axios
          .get('admin/surveys/get-info/' + editId)
          .then((res) => {
            return res.data
          })
          .then((data) => {
            title.setValue(data.title)
            slug.setValue(data.slug || createSlug(data.title))
            description.setValue(data.description)
          })
          .finally(() => setLoading(false))

        setLoading(true)
        axios
          .get('admin/surveys/questions/paging/' + editId)
          .then((res) => {
            return res.data
          })
          .then((data) => {
            setQuestions(data)
            setInitQuestions(data)
          })
          .finally(() => setLoading(false))
      } else {
        setInitQuestions([])
        setQuestions([])
        title.setValue(null)
        slug.setValue(null)
        description.setValue('')
      }
    }

    fetch()
  }, [addNewFlag, editId]) // eslint-disable-line react-hooks/exhaustive-deps

  const submitData = () => {
    let params = {
      title: title.value,
      slug: slug.value,
      description: description.value,
    }

    if (JSON.stringify(questions) !== JSON.stringify(initQuestions)) {
      params = {
        ...params,
        questions: questions.map((value) => value.id),
      }
    }
    setLoading(true)

    if (!addNewFlag && editId) {
      axios
        .post('admin/surveys/update', { id: editId, ...params })
        .then((res) => {
          if (res.data.failed) {
            errorMessage('C???p nh???t b???ng kh???o s??t kh???o s??t th???t b???i')
          } else {
            successMessage('C???p nh???t b???ng kh???o s??t kh???o s??t th??nh c??ng')
            editData({ id: editId, ...params })
          }
        })
        .finally(() => setLoading(false))
    } else {
      axios
        .post('admin/surveys/create', params)
        .then((res) => {
          if (res.data.failed) {
            errorMessage('T???o b???ng kh???o s??t kh???o s??t th???t b???i')
          } else {
            successMessage('T???o b???ng kh???o s??t kh???o s??t th??nh c??ng')
            addNew({
              id: res.data,
              created_at: moment().format(),
              ...params,
            })
          }
        })
        .finally(() => setLoading(false))
    }
  }

  return (
    <Drawer
      title={
        !addNewFlag && editId
          ? 'Thay ?????i th??ng tin b???ng kh???o s??t'
          : 'Th??m m???i b???ng kh???o s??t'
      }
      placement="right"
      closable={true}
      onClose={toggleModal}
      visible={modalOpen}
      width={'100%'}
      footer={
        step === '1' && (
          <Spin spinning={loading}>
            <div style={{ textAlign: 'right' }}>
              <Button color="danger" outline onClick={toggleModal}>
                <IntlMessages id="user.cancel" />
              </Button>{' '}
              {!addNewFlag && editId ? (
                <>
                  <ExportToExcel id={editId} />{' '}
                  <Button color="primary" onClick={submitData}>
                    C???p nh???t
                  </Button>
                </>
              ) : (
                <Button color="primary" onClick={submitData}>
                  Th??m m???i
                </Button>
              )}
            </div>
          </Spin>
        )
      }
    >
      <Spin spinning={loading}>
        <Steps
          addNewFlag={addNewFlag}
          editId={editId}
          title={title}
          slug={slug}
          description={description}
          questions={questions}
          setQuestions={setQuestions}
          setStep={setStep}
        />
      </Spin>
    </Drawer>
  )
}

export default AddAndEdit
