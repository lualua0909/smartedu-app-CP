import React, { useState, useEffect } from 'react'
import UserHeaderLayout from 'components/users/UserHeaderLayout'
import UserFooterLayout from 'components/users/UserFooterLayout'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import {
  UserProfileWrapper as Wrapper
} from 'atoms'
import { Modal, Form, DatePicker, Spin, message, } from 'antd'
import 'assets/user/ifa-profile.css'
import { LockOutlined } from '@ant-design/icons'
import { AVATAR_PATH, userLevelVN } from 'defines'
import moment from 'moment'
import axios from 'helpers/axios'
import useFormInput from 'helpers/useFormInput'
import useFormNumber from 'helpers/useFormNumber'
import detectMobile from 'helpers/detectMobile'

const randomize = Math.random()

const ProfilePage = props => {
  const [loading, setLoading] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [id, setId] = useState(null)

  const name = useFormInput()
  const description = useFormInput()
  const username = useFormInput()
  const phone = useFormNumber()
  const email = useFormInput()
  const birthday = useFormInput()
  const gender = useFormInput()
  const address = useFormInput()
  const job = useFormInput()
  const level = useFormInput()
  const partner = useFormInput()
  const position = useFormInput()
  const staffId = useFormInput()
  const department = useFormInput()

  const passwd = useFormInput()
  const confirmPasswd = useFormInput()

  useEffect(() => {
    setLoading(true)
    const _user = JSON.parse(localStorage.getItem('@current_user'))
    setId(_user.id)
    axios.get('get-user-info/' + _user.id)
      .then(res => {
        if (res.data.status === 200) {
          const data = res.data.data
          name.setValue(data.first_name + ' ' + data.last_name)
          description.setValue(data.description)
          username.setValue(data.username)
          phone.setValue(data.phone)
          email.setValue(data.email)
          birthday.setValue(data.birthday)
          gender.setValue(data.gender)
          address.setValue(data.address)
          job.setValue(data.job)
          level.setValue(data.level)
          partner.setValue(data.partner)
          position.setValue(data.position)
          staffId.setValue(data.staff_id)
          department.setValue(data.department)
        }
      })
      .finally(() => setLoading(false))

  }, [props.location.search])

  const chooseProfileAvatar = e => {
    e.preventDefault()
    document.getElementsByClassName('avatar-img-picker')[0].click()
  }
  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

  const finishChooseAvatar = async e => {
    e.preventDefault()
    const img = await toBase64(e.target.files[0])
    document.getElementsByClassName('avatar-img')[0].style.backgroundImage = `url(${img})`

    axios.post('users/upload-avatar', {
      image: img,
      type: 1
    })
      .then(res => {
        if (res.data.status === 200) {
          console.log('uploaded')
        }
      })
  }
  const chooseProfileCover = e => {
    e.preventDefault()
    document.getElementsByClassName('cover-img-picker')[0].click()
  }
  const finishChooseCover = async e => {
    e.preventDefault()
    const img = await toBase64(e.target.files[0])
    document.getElementsByClassName('profile-cover')[0].style.backgroundImage = `url(${img})`
    axios.post('users/upload-avatar', {
      image: img,
      type: 2
    })
      .then(res => {
        if (res.data.status === 200) {
          console.log('uploaded')
        }
      })
  }
  const changeToTextbox = e => {
    e.preventDefault()
    e.target.classList.add('d-none')
    e.target.closest(".change-to-textbox").querySelector('.textbox-area').classList.remove('d-none')
  }
  const closeDescriptionForm = e => {
    e.target.closest(".textbox-area").classList.add('d-none')
    e.target.closest(".description").querySelector('.description-link').classList.remove('d-none')
  }
  const cancelDescription = e => {
    e.preventDefault()
    closeDescriptionForm(e)
  }
  const saveDescription = e => {
    e.preventDefault()
    updateInfo('description', description.value)
    closeDescriptionForm(e)
  }

  const showInput = e => {
    e.preventDefault()
    e.target.closest(".info-value-block").querySelector("span").classList.add('d-none')
    e.target.closest(".info-value-block").querySelector(".info-value-input").classList.add('active')
    e.target.closest(".info-value-block").querySelector(".info-value-input").focus()
  }

  const updateInfo = (field, value) => {
    axios.post('users/update-by-field', { field, value })
      .then(res => {
        if (res.data.status === 200) {
          console.log('updated !')
        } else {
          message.error(res.data.msg)
        }
      })
  }

  const hideInput = (e, field, value) => {
    e.preventDefault()
    if (e.target.value === '') return
    e.target.closest(".info-value-block").querySelector("span").innerHTML = e.target.value
    e.target.closest(".info-value-block").querySelector("span").classList.remove('d-none')
    e.target.classList.remove('active')

    updateInfo(field, value)
  }

  const changePassWord = () => {
    setVisible(true)
  }

  const hideModal = () => {
    setVisible(false)
    passwd.setValue(null)
    confirmPasswd.setValue(null)
  }

  const saveModal = () => {
    if (passwd.value.length < 6) {
      message.error('M???t kh???u t???i thi???u 6 k?? t???')
    } else if (passwd.value !== confirmPasswd.value) {
      message.error('M???t kh???u x??c nh???n kh??ng tr??ng kh???p')
    }
    else {
      setModalLoading(true)
      axios.post('users/update-by-field', { field: 'password', value: passwd.value })
        .then(res => {
          if (res.data.status === 200) {
            message.success('Thay ?????i m???t kh???u th??nh c??ng !')
            hideModal()
          }
        })
        .finally(() => setModalLoading(false))
    }
  }

  const [visible, setVisible] = useState(false)

  return <>
    <UserHeaderLayout />
    <Spin spinning={loading} size='large' tip="??ang t???i th??ng tin ng?????i d??ng...">
      <Wrapper className="ifa-body-wrapper">
        <div className="ifa-container user-profile">
          <div className="ifa-block-content">
            <div className="profile-cover" style={{ backgroundImage: `url(${AVATAR_PATH + id + '-cover.webp?' + randomize})` }}>
              <div className="avatar-block">
                <input type="file" name="avatar" className="avatar-img-picker" accept="image/*"
                  onChange={finishChooseAvatar} />
                <div className="avatar-img" onClick={chooseProfileAvatar}
                  style={{ backgroundImage: `url(${AVATAR_PATH + id + '.webp?' + randomize})` }}>
                </div>
              </div>
             <div className="cover-block">
                <input type="file" name="cover" className="cover-img-picker" accept="image/*"
                  onChange={finishChooseCover} />
                <button className="change-cover-button" onClick={chooseProfileCover}>?????i ???nh b??a</button>
              </div>}
            </div>
            <div className="user-information">
              <div className="fullname info-block">
                <div className="info-value-block" onClick={showInput}>
                  <span>{name.value}</span>
                  <input type="text" className="info-value-input" {...name}
                    onBlur={e => hideInput(e, 'name', name.value)} />
                </div>
              </div>
              <div className="description change-to-textbox">
                <a href="#!" onClick={changeToTextbox} className="description-link">{description.value || 'Th??m m?? t??? c?? nh??n'}</a>
                <div className="textbox-area d-none">
                  <textarea placeholder="M?? t??? v??? b???n" {...description}></textarea>
                  <div className="list-button">
                    <DropdownButton id="dropdown-item-button" title="C??ng khai">
                      <Dropdown.Item as="button">C??ng khai</Dropdown.Item>
                      {/* <Dropdown.Item as="button">C?? nh??n</Dropdown.Item> */}
                    </DropdownButton>
                    <div className="right-button cancel-description" onClick={cancelDescription}>H???y</div>
                    <div className="right-button save-description" onClick={saveDescription}>L??u</div>
                  </div>
                </div>
              </div>
              {/* <div className="barcode" >
                <QRCode value={window.location.href} size={140} />
              </div> */}
              {/* <div className="invite-block">
                <Typography.Paragraph className="invite-txt" copyable={{ text: window.location.href + '?p=' + id }}>Copy link profile t???i ????y</Typography.Paragraph>
              </div> */}
              <div className="list-info">
                <div className="list-info-change-pw info-block">
                  <div className="info-value-block">
                    <span className="info-value-block" onClick={changePassWord}>?????i m???t kh???u</span>
                  </div>
                </div>
                <div>
                  <div className="info-block hide-icon user">
                    <div className="info-label">T??n ????ng nh???p*</div>
                    <div className="info-value-block">
                      <span>{username.value}</span>
                    </div>
                  </div>
                  <div className="info-block hide-icon user">
                    <div className="info-label">M?? nh??n vi??n*</div>
                    <div className="info-value-block" >
                      <span>{staffId.value}</span>
                    </div>
                  </div>
                  <div className="info-block phone">
                    <div className="info-label">S??? ??i???n tho???i*</div>
                    <div className="info-value-block" onClick={showInput}>
                      <span>{phone.value || 'Th??m s??? ??i???n tho???i'}</span>
                      <input type="text" className="info-value-input" {...phone} onBlur={e => hideInput(e, 'phone', phone.value)} />
                    </div>
                  </div>
                  <div className="info-block mail">
                    <div className="info-label">Email*</div>
                    <div className="info-value-block" onClick={showInput}>
                      <span>{email.value}</span>
                      <input type="text" className="info-value-input" {...email} onBlur={e => hideInput(e, 'email', email.value)} />
                    </div>
                  </div>
                  <div className="info-block birthday">
                    <div className="info-label">Ng??y sinh*</div>
                    <DatePicker
                      style={{ backgroundColor: '#eee', fontWeight: 'bold' }}
                      value={birthday.value ? moment(birthday.value) : null}
                      onChange={(date, dateStr) => {
                        birthday.setValue(dateStr)
                        updateInfo('birthday', dateStr)
                      }}
                      placeholderText="Ch???n ng??y sinh"
                    />
                  </div>
                  <div className="info-block hide-icon gender">
                    <div className="info-label">Gi???i t??nh*</div>
                    <div className="info-value-block">
                      <input type="radio" checked={gender.value == 1}
                        onChange={e => {
                          if (gender.value !== 1) {
                            gender.setValue(1)
                            updateInfo('gender', 1)
                          }
                        }} />
                      {' '}<span >Nam</span>
                      <input type="radio" checked={gender.value == 2}
                        onChange={e => {
                          if (gender.value !== 2) {
                            gender.setValue(2)
                            updateInfo('gender', 2)
                          }
                        }}
                        style={{ marginLeft: 10 }} />
                      {' '}<span >N???</span>
                    </div>
                  </div>
                  <div className="info-block address">
                    <div className="info-label">?????a ch??? hi???n t???i*</div>
                    <div className="info-value-block" onClick={showInput}>
                      <span>{address.value || 'Th??m ?????a ch???'}</span>
                      <input {...address} className="info-value-input" onBlur={e => hideInput(e, 'address', address.value)} />
                    </div>
                  </div>
                  <div className="info-block pro">
                    <div className="info-label">Ngh??? nghi???p*</div>
                    <div className="info-value-block" onClick={showInput}>
                      <span>{job.value || 'Th??m ngh??? nghi???p'}</span>
                      <input type="text" className="info-value-input" {...job} onBlur={e => hideInput(e, 'job', job.value)} />
                    </div>
                  </div>
                  <div className="info-block company">
                    <div className="info-label">T??n c??ng ty*</div>
                    <div className="info-value-block" onClick={showInput}>
                      <span>{partner.value}</span>
                      <input type="text" className="info-value-input"
                        {...partner} onBlur={e => hideInput(e, 'partner', partner.value)} />
                    </div>
                  </div>
                  <div className="info-block pos">
                    <div className="info-label">Ch???c v???*</div>
                    <div className="info-value-block" onClick={showInput}>
                      <span>{position.value}</span>
                      <input type="text" className="info-value-input" {...position}
                        onBlur={e => hideInput(e, 'position', position.value)} />
                    </div>
                  </div>
                  <div className="info-block department">
                    <div className="info-label">B??? ph???n*</div>
                    <div className="info-value-block" onClick={showInput}>
                      <span>{department.value}</span>
                      <input type="text" className="info-value-input" {...department}
                        onBlur={e => hideInput(e, 'department', department.value)} />
                    </div>
                  </div>
                  <div className="info-block hide-icon department">
                    <div className="info-label hide-icon">Ph??n quy???n*</div>
                    <div className="info-value-block" >
                      <span>{userLevelVN[level.value]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </Spin>
    <Modal
      visible={visible}
      centered
      onCancel={hideModal}
    >
      <Spin spinning={modalLoading}>
        <div className="modalinfo" id="modalinfo">
          <h2>Thay ?????i m???t kh???u</h2>
          <Form
            name="info"
          >
            <div className="modalinfo--info">
              {/* <div className="modalinfo--info-field">
              <div>
                <UserOutlined />
                <span className="text">T??n ????ng nh???p</span>
              </div>
              <input />
            </div> */}

              <div className="modalinfo--info-field">
                <div>
                  <LockOutlined />
                  <span className="text">M???t kh???u m???i</span>
                </div>
                <input type="password" {...passwd} />
              </div>
              <div className="modalinfo--info-field">
                <div>
                  <LockOutlined />
                  <span className="text">Nh???p l???i m???t kh???u</span>
                </div>
                <input type="password" {...confirmPasswd} />
              </div>
            </div>
            <div className="modalinfo--action">
              <button type="button" className="cancel" onClick={hideModal}>H???y</button>
              <button onClick={saveModal}>L??u</button>
            </div>
          </Form>
        </div>
      </Spin>
    </Modal>
    <UserFooterLayout />
  </>
}

export default ProfilePage