import React, { useState, useEffect } from 'react'
import { Badge, Button, Card, CardBody } from 'reactstrap'
import {
  Spin,
  Modal,
  Avatar,
  List,
  Progress,
  Upload,
  message
} from 'antd'
import axios from 'helpers/axios'
import readXlsxFile from 'read-excel-file'
import moment from 'moment'
import ReactExport from 'react-data-export'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const { Dragger } = Upload
const { confirm } = Modal

const generateUsername = (f_name, l_name, suffix) => {
  const name = f_name + ' ' + l_name
  const nameArr = name.split(' ')
  let username = nameArr[nameArr.length - 1].toLowerCase()
  nameArr.splice(-1)
  nameArr.map(item => {
    username += item.substring(0, 1).toLowerCase()
  })
  username += (Math.floor(Math.random() * 100) + 1)
  if (suffix) {
    return username + '.' + suffix
  }
  return username
}

const UsersExcelPages = () => {
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [fileList, setFileList] = useState([])
  const [data, setData] = useState([])
  // const [status, setStatus] = useState([])
  const [progress, setPropgress] = useState(0)

  const [partners, setPartners] = useState([])
  const [departments, setDepartments] = useState([])
  // const [positions, setPositions] = useState([])

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true)
      await axios
        .get('admin/partners/all')
        .then(res => {
          return res.data
        })
        .then(data => {
          setPartners(data.data)
        })

      await axios
        .get('admin/departments/all')
        .then(res => {
          return res.data
        })
        .then(data => {
          setDepartments(data)
        })

      // await axios
      //   .get('admin/positions/all')
      //   .then(res => {
      //     return res.data
      //   })
      //   .then(data => {
      //     setPositions(data)
      //   })

      setLoading(false)
    }

    fetchPartners()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpload = () => {
    readXlsxFile(fileList[0]).then(rows => {

      let [, ...rest] = rows
      rest.map((item, index) => {
        const username = generateUsername(item[0], item[1], item[2])
        rest[index][2] = username
      })
      setData(rest)
    })
  }

  const props = {
    beforeUpload: file => {
      setFileList([...fileList, file])
      return false
    },
    onChange: info => handleUpload(),
    fileList,
    multiple: false
  }

  const removeFromList = index => {
    confirm({
      title: 'B???n c?? ch???c ch???n mu???n x??a ng?????i d??ng n??y?',
      onOk() {
        setData(oldData => oldData.splice(index, 1))
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const insertListUser = () => {
    if (data.length > 0) {

      const n = data.length

      data.map(async (item, index) => {
        const params = {
          first_name: item[0],
          last_name: item[1],
          email: item[3],
          phone: item[5],
          address: item[6],
          birthday: moment(item[4], "DD-MM-YYYY").format("YYYY-MM-DD"),
          partner_id: item[7],
          department_id: item[8],
          username: item[2],
          password: item[2]
        }

        await axios.post('admin/user/create', params)
          .then(res => {
            setPropgress((((index + 1) / n) * 100).toFixed(0))
            message.success('???? th??m ng?????i d??ng')
          })
      })

      let _data = [...data]
      _data.forEach(a => a.splice(7, 1));
      _data.forEach(a => a.splice(7, 1));
      _data = _data.map(item => {
        return [
          item[0],
          item[1],
          item[2],
          item[2],
          item[3],
          item[4],
          item[5],
          item[6],
        ]
      })
      setData(_data)
      setUploaded(true)
    }
  }

  // const renderStatus = index => {
  //   if (status[index] === true) {
  //     return <Badge color='success' pill>???? th??m</Badge>
  //   } else if (status[index] === false) {
  //     return <Badge color='danger' pill>L???i</Badge>
  //   }
  // }

  const accept = () => {
    return '.xlsx,.xls,.csv'
  }

  const multiDataSet = [
    {
      columns: [
        { title: "Ho", style: { fill: { patternType: "solid", fgColor: { rgb: "FFCCEEFF" } } } },
        { title: "Ten", style: { fill: { patternType: "solid", fgColor: { rgb: "FFCCEEFF" } } } },
        { title: "Username", style: { fill: { patternType: "solid", fgColor: { rgb: "FFCCEEFF" } } } },
        { title: "Password", style: { fill: { patternType: "solid", fgColor: { rgb: "FFCCEEFF" } } } },
        { title: "Email", style: { fill: { patternType: "solid", fgColor: { rgb: "FFCCEEFF" } } } },
        { title: "NgaySinh", style: { fill: { patternType: "solid", fgColor: { rgb: "FFCCEEFF" } } } },
        { title: "SoDienThoai", style: { fill: { patternType: "solid", fgColor: { rgb: "FFCCEEFF" } } } },
        { title: "DiaChi", style: { fill: { patternType: "solid", fgColor: { rgb: "FFCCEEFF" } } } },
      ],
      data: data
    }
  ];

  return <Card>
    <CardBody>
      <Spin spinning={loading}>
        <Dragger {...props} maxCount={1} accept={accept()}>
          <p className="ant-upload-drag-icon">
            <span className='simple-icon-cloud-upload' style={{ fontSize: 32 }}></span>
          </p>
          <p className="ant-upload-text">K??o th??? file v??o khung n??y ????? upload</p>
          <p className="ant-upload-hint">?????nh d???ng: {accept()}</p>
        </Dragger>
        <List style={{ marginTop: 50 }}
          header={<div>Danh s??ch ng?????i d??ng<Progress percent={progress} style={{ width: '50%', marginLeft: 10 }} /></div>}
          footer={
            <>{!uploaded ? <Button onClick={insertListUser}>Th??m v??o h??? th???ng</Button>
              : <ExcelFile element={<button>Download Excel</button>}>
                <ExcelSheet dataSet={multiDataSet} name="Danh s??ch h???c vi??n" />
              </ExcelFile>}
            </>}
          bordered
          dataSource={data}
          renderItem={(item, index) => {
            if (!uploaded) {
              let partner = partners.filter(i => { return i.id === item[7] })
              partner = partner ? partner[0].name : ''
              let department = departments.filter(i => { return i.id === item[8] })
              department = department ? department[0].name : ''

              return <List.Item
                actions={[<a onClick={() => removeFromList(index)}>X??a</a>]}>
                <List.Item.Meta
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item[0] + ' ' + item[1] + ' (' + item[2] + ')'}
                  description={item[3]
                    + ' - ' + item[4]
                    + ' - ' + item[5]
                    + ' - ' + item[6]
                    + ' - ' + partner
                    + ' - ' + department
                  }
                />
              </List.Item>
            }
          }}
        />
      </Spin>
    </CardBody>
  </Card>
}

export default UsersExcelPages

