import React, { useState, useEffect } from 'react'
import { Tabs, Button, List, Spin, Alert, Modal } from 'antd'
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
// import fileDownload from 'js-file-download'
import axios from 'helpers/axios'
import FileUpload from 'atoms/fileUpload'

const { confirm } = Modal;
const { TabPane } = Tabs
const VIDEO_EXT = ["mp4", "ogg"]
const DOCUMENT_EXT = ["pdf", "docx", "doc"]

const FileManager = ({ attachFile, zip = false, fileType = 'all', fileId = null }) => {
    const [currentTab, setCurrentTab] = useState("1")
    const [currentFile, setCurrentFile] = useState(null)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (fileId) {
            setCurrentFile(fileId)
        }
    }, [fileId])

    useEffect(() => {
        setLoading(true)
        axios
            .get('admin/file-managers/all')
            .then(res => {
                if (fileType === 'video') {
                    setData(res.data.filter(i => {
                        if (VIDEO_EXT.some(v => { return i.file_path.indexOf(v) >= 0 })) {
                            return i
                        }
                    }))
                } else if (fileType === 'document') {
                    setData(res.data.filter(i => {
                        if (DOCUMENT_EXT.some(v => { return i.file_path.indexOf(v) >= 0 })) {
                            return i
                        }
                    }))
                }
                //  else if (fileType === 'scorm') {
                //     setData(res.data.filter(i => {
                //         const str = DIRECTORY_PATTERN.exec(i.file_path)[1]
                //         if (str && str.length > 4) {
                //             return i
                //         }
                //     }))
                // } 
                else {
                    setData(res.data)
                }
            })
            .finally(() => setLoading(false))
    }, [])

    const uploadedFile = (id, fileName, fileSize) => {
        setData([
            { id: id, file_path: fileName, size: fileSize },
            ...data
        ])
        setCurrentTab("1")
    }

    // const download = (url, fileName) => {
    //     setLoading(true)
    //     axios.get(url, { responseType: 'blob' })
    //         .then(res => {
    //             fileDownload(res.data, fileName)
    //         })
    //         .finally(() => setLoading(false))
    // }

    const removeFile = (fileId, filePath) => {
        setLoading(true)
        const params = {
            file_id: fileId,
            file_path: filePath
        }
        axios
            .post('admin/file-managers/remove', params)
            .then(res => {
                const newItems = data.filter(i => i.id !== fileId)
                setData(newItems)
            })
            .finally(() => setLoading(false))
    }

    return <>
        {currentFile && currentFile.file_path &&
            <Alert message={'???? ch???n file: ' + currentFile.file_path.split('/').slice(-1).pop()}
                type="success" />
        }
        <br />
        <Tabs tabPosition='left' activeKey={currentTab} onChange={setCurrentTab}>
            <TabPane tab="File hi???n c??" key="1">
                <Spin spinning={loading}>
                    <List style={{ height: 300, overflow: 'auto' }}
                        className="scrollbar"
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => {
                            const fileName = item.file_path.split('/').slice(-1).pop()

                            return <List.Item
                                actions={[
                                    // <Button icon={<DownloadOutlined onClick={() => download(item.file_path, fileName)} />} size={'middle'} />,
                                    !currentFile || item.id !== currentFile.id ?
                                        <Button type="primary"
                                            icon={<PlusOutlined onClick={() => {
                                                attachFile(item.id)
                                                setCurrentFile(item)
                                            }} />}
                                            size='middle' />
                                        : null,
                                    !currentFile || item.id !== currentFile.id ?
                                        <Button type="danger" icon={<DeleteOutlined />}
                                            size='middle'
                                            onClick={() => {
                                                confirm({
                                                    title: 'X??c nh???n x??a file n??y?',
                                                    icon: <ExclamationCircleOutlined />,
                                                    content: 'H??nh ?????ng n??y kh??ng th??? ho??n t??c',
                                                    onOk() {
                                                        removeFile(item.id, item.file_path)
                                                    },
                                                    onCancel() {
                                                        console.log('Cancel');
                                                    },
                                                });
                                            }} />
                                        : null
                                ]}
                            >
                                <List.Item.Meta description={fileName} />
                                <div>{item.size && parseInt(item.size).toFixed(1)}MB</div>
                            </List.Item>
                        }}
                    />
                </Spin>
            </TabPane>
            <TabPane tab="T???i l??n file m???i" key="2" style={{ paddingBottom: 20 }}>
                <Spin spinning={loading}>
                    <FileUpload uploadedFile={uploadedFile} zip={zip} fileType={fileType} />
                </Spin>
            </TabPane>
        </Tabs>
    </>
}
export default FileManager