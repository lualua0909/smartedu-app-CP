import React, { useState, useEffect } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import UserHeaderLayout from 'components/users/UserHeaderLayout'
import UserFooterLayout from 'components/users/UserFooterLayout'
import Modal from 'react-bootstrap/Modal'
import wrong from 'atoms/home/wrong.svg'
import bgVideoBlock from 'atoms/home/bgVideoBlock.svg'
import bgWhyChoose from 'atoms/home/bgWhyChoose.svg'
import bgMethod from 'atoms/home/bgMethod.svg'
import MethodItem from 'components/users/MethodItem'
import WhyItem from 'components/users/WhyItem'
import { Badge, Typography, notification, Alert, Rate, Button } from 'antd'
import detectMobile from 'helpers/detectMobile'
import 'assets/user/ifa-home.css'
import 'assets/user/ifa-form.css'
import { toCurrency } from 'helpers/Utils'
import useFormInput from 'helpers/useFormInput'
import axios from 'helpers/axios'
import knowledge from 'atoms/home/knowledge.svg'
import oppbase from 'atoms/home/1opp-base.svg'
import runsvg from 'atoms/home/2run.svg'
import medalsvg from 'atoms/home/3medal.svg'
import InfiniteCarousel from 'react-leaf-carousel'
import momentTime from 'helpers/moment'

import s8_1 from 'atoms/home/s8-1.svg'
import s8_2 from 'atoms/home/s8-2.svg'
import s8_3 from 'atoms/home/s8-3.svg'
import s8_4 from 'atoms/home/s8-4.svg'
import s8_5 from 'atoms/home/s8-5.svg'
import s8_6 from 'atoms/home/s8-6.svg'

import s2_1 from 'atoms/home/s2-1.jpg'
import s2_2 from 'atoms/home/s2-2.jpg'
import s2_3 from 'atoms/home/s2-3.jpg'
import s2_4 from 'atoms/home/s2-4.jpg'
import s2_5 from 'atoms/home/s2-5.jpg'
import s2_6 from 'atoms/home/s2-6.jpg'
import s2_7 from 'atoms/home/s2-7.jpg'
import s2_8 from 'atoms/home/s2-8.jpg'
import s1_1_cp from 'atoms/home/001-01.jpg'
import s1_2_cp from 'atoms/home/001-02.jpg'
import s1_3_cp from 'atoms/home/001-03.jpg'
import s1_4_cp from 'atoms/home/001-04.jpg'
import { NEWS_PATH, CATE_PATH, COURSES_PATH } from 'defines'
// import { Avatar } from 'atoms'
const { Paragraph } = Typography

const whyItemDatas = [
  {
    image: s2_1,
    title: 'Ch??? ?????ng h???c t???p',
    content:
      'Gi??p h???c vi??n ti???p c???n ki???n th???c m???t c??ch ch??? ?????ng v?? c?? th??? linh ho???t h???c m???i l??c m???i n??i',
  },
  {
    image: s2_2,
    title: 'Ch???ng ch??? Qu???c t???',
    content:
      'N??ng cao tr??nh ????? chuy??n m??n, k??? n??ng v???i ??a d???ng c??c kh??a h???c v?? ch???ng ch??? Qu???c t??? v???i m?? QR ?????m b???o t??nh x??c th???c',
  },
  {
    image: s2_3,
    title: 'One-by-one live',
    content:
      'Tr???i nghi???m con ???????ng ti???p c???n ki???n th???c th??ng qua t????ng t??c tr???c tuy???n 1:1 v???i c??c chuy??n gia ?????u ng??nh',
  },
  {
    image: s2_4,
    title: 'C???ng ?????ng h???c t???p',
    content:
      'C???ng ?????ng h???c t???p built-in gi??p h???c vi??n t????ng t??c, h??? tr??? l???n nhau trong qu?? tr??nh h???c t???',
  },
  {
    image: s2_5,
    title: 'Ki???m tra ki???n th???c',
    content:
      'C??c b??i ki???m tra, b??i thi ????nh gi?? n??ng l???c, gi??p h???c vi??n th???c nghi???m l???i nh???ng ki???n th???c ???? h???c',
  },
  {
    image: s2_6,
    title: 'K?? thi th???c t???',
    content:
      'Ph??ng thi tr???c tuy???n ???????c m?? ph???ng th???c t???, k???t qu??? ????a ra ch??nh x??c, c??ng b???ng v?? minh b???ch',
  },
  {
    image: s2_7,
    title: 'Khen th?????ng v?? qu?? t???ng',
    content:
      'H??? th???ng ??i???m th?????ng, qu?? t???ng phong ph?? d???a tr??n th??nh t??ch h???c t???p c???a h???c vi??n',
  },
  {
    image: s2_8,
    title: 'Giao di???n hi???n ?????i',
    content:
      '???????c thi???t k??? hi???n ?????i mang t??nh th???m m??? cao c?? th??? ti???p c???n theo h?????ng d??? s??? d???ng v?? ti???n l???i cho ng?????i h???c',
  },
]

const methodDatas = [
  {
    icon: knowledge,
    title: 'GAME-BASE',
    subTitle: 'H???c qua tr?? ch??i',
    content:
      'Bi???n tr?? ch??i th??nh b??i h???c c?? ?? ngh??a kh??ng ch??? gi??p gia t??ng t????ng t??c c???a ng?????i h???c v?? b??i gi???ng m?? c??n k??ch th??ch mong mu???n h???c t???p trong m???i ng?????i',
  },
  {
    icon: oppbase,
    title: 'OPERATION-BASE',
    subTitle: 'H???c b???ng t????ng t??c',
    content:
      'H??? tr??? tr??ch xu???t b??o c??o t???c th?? gi??p doanh nghi???p ????nh gi?? ???????c ch???t l?????ng ng?????i h???c ????? t??? ???? x??y d???ng n???i dung ????o t???o ph?? h???p',
  },
  {
    icon: runsvg,
    title: 'ACTIVITY-BASE',
    subTitle: 'H???c qua ho???t ?????ng',
    content:
      'Thay ?????i th??i quen h???c th??? ?????ng th?????ng th???y ph????ng ph??p gi??p ng?????i h???c ch??? ?????ng kh??m ph?? ki???n th???c n??n ghi nh??? n???i dung d??? d??ng h??n',
  },
  {
    icon: medalsvg,
    title: 'LEADERBOARD-BASE',
    subTitle: 'B???ng x???p h???ng',
    content:
      'K??ch th??ch thi ??ua qua b???ng x???p h???ng l?? ph????ng ph??p gi??p ng?????i h???c ch??? ?????ng ????nh gi?? ???????c kh??? n??ng b???n th??n t??? ???? c?? ?????ng l???c h???c t???p ????? ti???n l??n',
  },
]

const partnerIcons = 23

const toMentorDatas = [
  {
    icon: s8_1,
    title: 'X??y d???ng h??nh ???nh chuy??n gia',
    content:
      'Tr??? th??nh chuy??n gia c???a ch??ng t??i v?? ???????c h??? tr??? h??nh ???nh chuy??n nghi???p',
  },
  {
    icon: s8_2,
    title: 'Thu nh???p linh ?????ng',
    content:
      'T???o ra ngu???n thu nh???p v?? linh ho???t d???a theo th???i gian c???a b???n. Kh??ng r??ng bu???c th???i gian',
  },
  {
    icon: s8_3,
    title: 'C??ng c??? ti???n l???i',
    content:
      'D??? d??ng h??? tr??? c???ng ?????ng m???i l??c m???i n??i d???a tr??n n???n t???ng Platform',
  },
  {
    icon: s8_4,
    title: 'Gia nh???p c???ng ?????ng mentor CP Learning Center',
    content:
      'Tham gia l??m mentor CP Learning Center kh??ng r??ng bu???c v?? c?? th??? chia s??? c??c gi?? tr??? chung cho c???ng ?????ng',
  },
  {
    icon: s8_5,
    title: 'C?? h???i h???p t??c trong c???ng ?????ng',
    content:
      'M???i th??nh vi??n ?????u c?? c?? h???i m??? r???ng quan h??? v???i ?????ng nghi???p, h???c h???i t??? nhi???u ng?????i, ?????ng th???i d???y v?? k??m c???p c??c h???c vi??n c?? mong mu???n ???????c h???c',
  },
  {
    icon: s8_6,
    title: 'Kh??ng r??ng bu???c v??? th???i gian, ?????a ??i???m',
    content:
      'C??c chuy??n gia c?? th??? tham gia v??o b???t k?? th???i gian n??o v?? b???t k??? n??i ????u',
  },
]

const MainPage = () => {
  const [show, setShow] = useState(false)
  const [_err, setErr] = useState(false)

  const [data, setData] = useState(null)

  const companyName = useFormInput()
  const name = useFormInput()
  const phone = useFormInput()
  const email = useFormInput()
  const content = useFormInput()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    axios.get('homepage-info').then((res) => {
      setData(res?.data?.data)
      // document.getElementById('myvideo').src =
      //   'https://www.youtube.com/embed/ybUUlBClmFM'
    })
  }, [])

  const openNotificationWithIcon = (type = 'success') => {
    notification[type]({
      message: 'Th??ng b??o t??? CP Learning Center',
      description:
        '???? g???i th??ng tin ?????n Smart Edu, ch??ng t??i s??? ph???n h???i cho b???n th??ng qua email ho???c s??? ??i???n tho???i, xin c???m ??n !',
    })
  }

  const submitConsulting = (e) => {
    e.preventDefault()
    if (
      name.value === '' ||
      phone.value === '' ||
      email.value === '' ||
      content.value === ''
    ) {
      setErr(true)
    } else {
      const params = {
        company_name: companyName.value,
        name: name.value,
        phone: phone.value,
        email: email.value,
        content: content.value,
      }

      axios.post('add-form-consulting', params)

      setErr(false)
      handleClose()
      openNotificationWithIcon()
    }
  }

  // const renderPrice = item => {
  //   if (item.old_price > 0) {
  //     if (item.new_price > 0) {
  //       return <div className="price">
  //         <span className="sell">
  //           <span className="number">{toCurrency(item.new_price)}</span>
  //         </span>
  //         <span className="origin">
  //           <span className="number">{toCurrency(item.old_price)}</span>
  //         </span>
  //       </div>
  //     } else {
  //       return <div className="price">
  //         <span className="sell">
  //           <span className="number">{toCurrency(item.old_price)}</span>
  //         </span>
  //       </div>
  //     }
  //   }
  //   return <div className="price">
  //     <span className="sell">
  //       <span className="number">???????c t??i tr???</span>
  //     </span>
  //   </div>
  // }

  return (
    <>
      <UserHeaderLayout />
      <div className="ifa-body-wrapper ">
        <div
          className="ifa-container ifa-video-block  "
        >
          <img
            src={
              process.env.PUBLIC_URL + '/assets/img/web/home/CoverTrangbia3.png'
            } />
          <div className="row ifa-block-content ifa-video-block-content container d-none">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12 img ">
              <iframe
                title="myvideo"
                id="myvideo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe>
            </div>
            {/* <div className="col-xl-4 col-lg-12 col-md-12 col-12"> */}
            {/* <p className="header-title">
                Cung c???p gi???i ph??p ????o t???o tr???c tuy???n
              </p>
              <p className="header-content">
                CP Learning Center l?? m???t h??? th???ng Qu???n l?? ????o t???o tr???c tuy???n nh???m h??? tr???
                Qu???n l?? v?? th???c hi???n ????o t???o tr???c tuy???n m???t c??ch to??n di???n. Gi??p
                ng?????i h???c v???a h???ng th?? v???i kho?? h???c, v???a c?? th??? ?????t ???????c k???t qu???
                t????ng t??? nh?? h???c truy???n th???ng v???i chi ph?? th???p nh???t m?? kh??ng c???n
                ph???i ?????n l???p.
              </p> */} {/* </div> */}

            {/* <div className="col-lg-12 col-md-12 col-12 btn-dang-ky-tu-van-block">
              <div className="btn-dang-ky-tu-van" onClick={handleShow}>
                ????ng k?? t?? v???n
              </div>
            </div> */}
          </div>
        </div>

        <div
          className="ifa-container ifa-why-block"
          style={{ backgroundImage: `url(${bgWhyChoose})` }}
        >
          {/* <div className="ifa-block-content ifa-why-block-content container">
            <p className="top-small-text">T???i sao ch???n CP Learning Center</p>
            <p className="top-lg-text">
              CP Learning Center kh??ng ch??? l?? m???t n???n t???ng ????o t???o
            </p>
            <div className="row ifa-list-item">
              {whyItemDatas.map((item, index) => (
                <div
                  className="col-lg-3 col-md-6 col-sm-6 col-12 why-item"
                  key={index}
                >
                  <WhyItem
                    item={{
                      img: item.image,
                      title: item.title,
                      content: item.content,
                    }}
                  />
                </div>
              ))}
              <div className="col-lg-12 col-md-12 btn-dang-ky-tu-van-why-block">
                <div className="btn-dang-ky-tu-van" onClick={handleShow}>
                  ????ng k?? t?? v???n
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* <div className="ifa-container ifa-elearning-block">
          <div className="ifa-block-content ifa-elearning-block-content container">
            <p className="top-small-text">T??m hi???u v??? CP Learning Center</p>
            <p className="top-lg-text">
              Cung c???p Gi???i ph??p ????o t???o Nh??n s??? to??n di???n
            </p>
            <div className="row ifa-list-item">
              <div className="col-lg-6 col-md-6 col-sm-6 col-12s item-wrapper">
                <div className="item ifa-item">
                  <div className="item-img-block">
                    <img
                      src={
                        process.env.PUBLIC_URL + '/assets/img/web/home/38.webp'
                      }
                      alt="video"
                    />
                  </div>
                  <div className="item-content-block">
                    <div className="title">
                      Ch????ng tr??nh E-Learning v?? h??? th???ng LMS CP Learning Center
                    </div>
                    <div className="item-content-block-wrapper">
                      <div className="item-content-block">
                        Cung c???p c??c ch????ng tr??nh ????o t???o theo h??nh th???c{' '}
                        <b>Blended Learning</b>, h???c vi??n h???c t???p Online tr??n h???
                        th???ng LMS CP Learning Center k???t h???p c??c bu???i workshop (Offline)
                        ho???c tr??n n???n t???ng Webinar c???a h??? th???ng. H???c vi??n ???????c
                        c???p <b>m?? QR </b>
                        ????? qu???n l?? c??c kh??a h???c c???a m??nh
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-6 col-12 item-wrapper">
                <div className="item ifa-item">
                  <div className="item-img-block">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        '/assets/img/web/home/38-2.webp'
                      }
                      alt="video"
                    />
                  </div>
                  <div className="item-content-block">
                    <div className="title">
                      Cung c???p d???ch v??? s??? h??a b??i gi???ng
                    </div>
                    <div className="item-content-block-wrapper">
                      <div className="item-content-block">
                        D???ch v??? s??? h??a m???i n???i dung ????o t???o theo nhu c???u ri??ng
                        c???a doanh nghi???p (Quy tr??nh, quy ?????nh, k?? n??ng, nghi???p
                        v???, th??ng tin s???n ph???m, ...) v?? h??? tr??? b??o c??o k???t qu???
                        ng?????i h???c. T???t c??? nh???ng n???i dung s??? h??a s??? ???????c ????a l??n
                        h??? th???ng LMS CP Learning Center ???????c c???p quy???n ri??ng cho Doanh
                        nghi???p t??? qu???n l?? v?? ????nh gi?? k???t qu??? nh??n vi??n th??ng
                        qua h??? th???ng
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="btn-dang-ky-tu-van-block container" style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <div className="btn-dang-ky-tu-van t-css" onClick={() => {
            window.open('/coming-soon', '_blank')
          }} >T??m hi???u th??m</div>
        </div>
        </div> */}

        {/* SAU NAY LA SILDER */}
        <div className="ifa-container ifa-method-block">
          <div className="container ifa-block-content">
            <div className="top-small-text">Gi???i thi???u v??? c??c kh??a h???c</div>
            <div className="title-home">
              {' '}
              C??c kh??a ????o t???o HRD - CPV - Learning Center
            </div>
            <div className="row list-cat-course-home">
              <div className=" col-lg-3 col-md-6 col-sm-6 col-12  ">
                <div className="card cat-course-home">
                  <div className="imgstyle-cat">
                    <img src={s1_1_cp} />
                  </div>
                  <div className="cat-name-home bg-blue  cut-text-2-line t-cap">
                    {' '}
                    CPV Concept Learning
                  </div>
                </div>
              </div>
              <div className=" col-lg-3 col-md-6 col-sm-6 col-12  ">
                <div className="card cat-course-home">
                  <div className="imgstyle-cat">
                    <img src={s1_2_cp} />
                  </div>
                  <div className="cat-name-home bg-green cut-text-2-line t-cap">
                    CPF Way Course
                  </div>
                </div>
              </div>
              <div className=" col-lg-3 col-md-6 col-sm-6 col-12  ">
                <div className="card cat-course-home">
                  <div className="imgstyle-cat">
                    <img src={s1_3_cp} />
                  </div>
                  <div className="cat-name-home bg-blue cut-text-2-line t-cap">
                    {' '}
                    SD1,2,3 - Standard Course
                  </div>
                </div>
              </div>

              <div className=" col-lg-3 col-md-6 col-sm-6 col-12 ">
                <div className="card cat-course-home">
                  <div className="imgstyle-cat">
                    <img src={s1_4_cp} />
                  </div>
                  <div className="cat-name-home bg-green cut-text-2-line t-cap">
                    {' '}
                    7 Habits
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="ifa-container">
            <div className="ifa-block-content ifa-method-block-content container">
              <p className="top-small-text">Kh??a h???c c?? g?? n???i b???t?</p>
              <p className="top-lg-text">
                T???o h???ng th?? v???i m???i b??i h???c th??ng qua
              </p>
              <div className="row ifa-list-item">
                {methodDatas.map((item, index) => (
                  <div
                    className="col-lg-3 col-md-6 col-sm-6 col-12 item-wrapper"
                    key={index}
                  >
                    <MethodItem item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div> */}

          {/* <div className="ifa-container ifa-course-block container-fluid">
          <div className="ifa-block-content ifa-course-block-content">
            <p className="top-small-text">
              H??? th???ng CP Learning Center c?? nh???ng kh??a h???c n??o?
            </p>
            <p className="top-lg-text">
              Kh??a h???c tr???c tuy???n
            </p>
            <div className="list-course-block">
              {data && data.pinned_course &&
                <div className="container-fluid big-item ifa-item">
                  <a href="/course-details/2" className="row">
                    <Avatar src={COURSES_PATH + data.pinned_course.id + '.webp?' + Math.random()}
                      height={300}
                      borderRadius={'5px 0 0 0'} />
                    <div className="col-lg-6 content ">
                      <p className="title">
                        <Paragraph ellipsis={{ rows: 3 }} >{data.pinned_course.title}</Paragraph>
                      </p>
                      <div className="description-wrapper">
                        <p className="description">{data.pinned_course.s_des}</p>
                      </div>
                      {renderPrice(data.pinned_course)}
                      <div className="rate-wrapper">
                        <Rate disabled defaultValue={Math.round(data.pinned_course.rating)} />
                      </div>
                    </div>
                  </a>
                </div>
              }
              {detectMobile() ? <Carousel className="list-small-item-mobile">
                {data && data.courses && data.courses.map((item, index) =>
                  <Carousel.Item interval={3000}>
                    <Badge.Ribbon text="Best Seller" color="#F88417">
                      <div className="item">
                        <a href="/">
                          <Avatar src={COURSES_PATH + item.id + '.webp?' + Math.random()}
                            height={50}
                            width={100}
                            borderRadius={'5px 0 0 0'} />
                          <div className="like-icon"></div>
                          <div className="content ">
                            <p className="title">Graphic Designer & Visual Thinking 2021</p>
                            <p className="description">Maven Analytics, Chris Dutton</p>
                            <div className="price">
                              <span className="sell"><span className="number">{toCurrency(130000)}</span></span>
                              <span className="origin"><span className="number">{toCurrency(130000)}</span></span>
                            </div>
                            <div className="rate-wrapper">
                              <div className="rate">4.5</div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </Badge.Ribbon>
                  </Carousel.Item>
                )}
              </Carousel>
                :
                <div className="list-small-item">
                  {data && data.courses && data.courses.map((item, index) =>
                    <div className="item ifa-item">
                      <a href="/">
                        <Avatar src={COURSES_PATH + item.id + '.webp?' + Math.random()}
                          height={200}
                          width={270}
                          borderRadius={5} />
                        <div className="like-icon"></div>
                        <div className="content offline-class">
                          <p className="title">
                            <Paragraph ellipsis={{ rows: 2 }} >{item.title}</Paragraph>
                          </p>
                          <p className="description">
                            <Paragraph ellipsis={{ rows: 2 }} >{item.s_des}</Paragraph>
                          </p>
                          {renderPrice(item)}
                          <div className="rate-wrapper" style={{ paddingBottom: 15 }}>
                            <Rate disabled defaultValue={Math.round(item.rating)} />
                          </div>
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              }
            </div>
          </div>
        </div> */}

          {/* <div className="ifa-container ifa-category-block">
          <div className="ifa-block-content">
            <p className="top-lg-text">??a d???ng th??? lo???i</p>
            <div className="row ifa-list-item">
              {data && data.course_groups && data.course_groups.map((item, index) =>
                <div className="col-lg-3 col-md-6 col-sm-6 col-6 item-wrapper" key={index}>
                  <div className="item" style={{ backgroundImage: `url(${CATE_PATH + item.id + '.svg'})`, border: '1px solid #eee' }}>
                    <p className="title">
                      <a href={'/the-loai/' + item.id}>{item.name}</a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div> */}

          {/* <div className="ifa-container ifa-connect-pro-block ">
            <div className="ifa-block-content container">
              <p className="top-small-text">K???t n???i v???i chuy??n gia c???c d???</p>
              <p className="top-lg-text">One - by - One Live</p>
              <div className="row ifa-list-item t-css">
                <div
                  className="col-lg-6 col-md-6 col-sm-12 col-12 item-wrapper "
                  style={{
                    borderRadius: 5,
                    backgroundImage: `url(${process.env.PUBLIC_URL + '/assets/img/web/home/43.webp'
                      })`,
                  }}
                ></div>

                <div className="col-lg-6 col-md-6 col-sm-12 col-12 item-wrapper">
                  <ul>
                    <li>K???t n???i m???i l??c m???i n??i</li>
                    <li>Bi???t tr?????c chi ph?? t?? v????n</li>
                    <li>
                      Chuy??n gia uy t??n, ch???ng ch???, b???ng c???p ???????c ch???ng nh???n
                    </li>
                    <li>Gi???i quy???t nhanh v???n ????? c???a b???n</li>
                    <li>Linh ho???t th???i gian t????ng t??c</li>
                  </ul>
                  <div className="btn-dang-ky-tu-van-why-block">
                    <a href="/onebyone-live" className="btn-dang-ky-tu-van">
                      T??m hi???u th??m
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="ifa-container ifa-our-pro-block">
          <div className="ifa-block-content">
            <p className="top-lg-text">
              ?????i ng?? chuy??n gia
            </p>
            {detectMobile() ? <Carousel className="list-our-pro-mobile">
              <Carousel.Item interval={3000}>
                <div className="item">
                  <div className="image">
                    <img src={process.env.PUBLIC_URL + '/assets/img/web/home/44.png'} alt="video" />
                  </div>
                  <div className="content">
                    <div className="line">
                      <p className="name">Julio.R</p>
                    </div>
                    <div className="line">
                      <p className="position">Web Deverloper</p>
                    </div>
                    <div className="line">
                      <p className="company">T???p ??o??n Vingroup</p>
                    </div>
                    <div className="line">
                      <p className="description">Ti???n s?? Chuck ???? s???ng v?? l??m vi???c t???i Vi???t Nam kho???ng 20 n??m. Kinh nghi???m c???a ??ng ?????n t??? vi???c kinh doanh xu???t nh???p kh???u, n??i ??ng c?? th??? truy???n c???m h???ng cho nh???ng ng?????i tr??? trong t????ng lai</p>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            </Carousel>
              :
              <Carousel className="list-our-pro">
                <Carousel.Item interval={3000}>
                  <div className="item">
                    <div className="image">
                      <img src={process.env.PUBLIC_URL + '/assets/img/web/home/44.png'} alt="video" />
                    </div>
                    <div className="content">
                      <div className="line">
                        <p className="name">Julio.R</p>
                      </div>
                      <div className="line">
                        <p className="position">Web Deverloper</p>
                      </div>
                      <div className="line">
                        <p className="company">T???p ??o??n Vingroup</p>
                      </div>
                      <div className="line">
                        <p className="description">Ti???n s?? Chuck ???? s???ng v?? l??m vi???c t???i Vi???t Nam kho???ng 20 n??m. Kinh nghi???m c???a ??ng ?????n t??? vi???c kinh doanh xu???t nh???p kh???u, n??i ??ng c?? th??? truy???n c???m h???ng cho nh???ng ng?????i tr??? trong t????ng lai</p>
                      </div>
                    </div>
                  </div>
                </Carousel.Item>
              </Carousel>}
          </div>
        </div> */}
          {/*         
          <div className="ifa-container ifa-share-block">
            <div className=" ifa-block-content container">
              <p className="top-small-text">Chia s??? ki???n th???c v???i c???ng ?????ng</p>
              <p className="top-lg-text">Tr??? th??nh chuy??n gia c??ng CP Learning Center</p>
              <div className="row">
                {toMentorDatas.map((item, index) => (
                  <div className="col-lg-4 col-md-6 item" key={index}>
                    <div className="icon">
                      <img src={item.icon} alt="video" />
                    </div>
                    <p className="title">{item.title}</p>
                    <p className="description">{item.content}</p>
                  </div>
                ))}
              </div>
              <div className="btn-dang-ky-tu-van-block">
                <div
                  className="btn-dang-ky-tu-van"
                  onClick={() => {
                    window.open('/expert-about', '_blank')
                  }}
                >
                  T??m hi???u th??m
                </div>
              </div>
            </div>
          </div>
        */}
        </div>

        <div className="ifa-container ifa-news-elearning mt-80">
          {/* <div className="ifa-container ifa-news-elearning" style={{ backgroundImage: `url(${bgNewsElearning})` }}> */}
          <div className="container ifa-container ifa-news-block ">
            <div className="ifa-block-content container ">
              {/* <p className="top-small-text">Li??n t???c nh???ng ho???t ?????ng s??i n???i</p> */}
              <p className="top-lg-text title-home">Tin t???c - S??? ki???n</p>
              <div className="row list-news">
                {data &&
                  data.news &&
                  data.news.map((item, index) => (
                    <div
                      className=" col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12"
                      key={index}
                    >
                      <div className="item ifa-item item-tintuc-home card mb-20">
                        <a href={'/news?p=' + item.id}>
                          <div
                            className="img"
                            style={{
                              borderTopLeftRadius: 5,
                              borderTopRightRadius: 5,
                              height: 200,
                              backgroundImage: `url(${NEWS_PATH + item.id + '.webp?' + Math.random()
                                })`,
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat',
                            }}
                          ></div>
                          <div className="content">
                            <div className="status-wrapper">
                              {/* <span className="pos">???? ????ng | </span> */}
                              {/* <span className="status live">
                                {momentTime(item.created_at)}
                              </span> */}
                            </div>
                            <div className="title t-cap">
                              <Paragraph ellipsis={{ rows: 3 }}>
                                {item.title}
                              </Paragraph>
                            </div>
                            <div className="description">{item.s_des}</div>
                          </div>
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="btn-dang-ky-tu-van-block">
                <a href="/news" className="btn-dang-ky-tu-van">
                  Xem t???t c???
                </a>
              </div>
            </div>
          </div>
          {/* <div className="ifa-partner-block ifa-block-content container">
            <p className="top-small-text">?????i t??c c???a CP Learning Center</p>
            <p className="top-lg-text" style={{ marginBottom: 50 }}>
              200+ c??ng ty v?? doanh nghi???p danh ti???ng
            </p>
            <InfiniteCarousel
              scrollOnDevice={true}
              breakpoints={[
                {
                  breakpoint: 500,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                  },
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                  },
                },
              ]}
              dots={false}
              showSides={true}
              sidesOpacity={1}
              sideSize={0.1}
              slidesToScroll={1}
              slidesToShow={6}
              scrollOnDevice={true}
              autoCycle={true}
              pauseOnHover={true}
              cycleInterval={2000}
              animationDuration={1000}
            >
              {[...Array(partnerIcons)].map(
                (item, index) =>
                  index > 0 && (
                    <div key={index}>
                      <img
                        style={{ width: 120 }}
                        src={
                          process.env.PUBLIC_URL +
                          '/assets/img/web/home/' +
                          index +
                          '.jpg'
                        }
                        alt="video"
                      />
                    </div>
                  )
              )}
            </InfiniteCarousel>
          </div> */}
        </div>
      </div>

      <Modal show={show} onHide={handleClose} className="ifa-modal">
        <Modal.Body>
          <button
            className="ifa-popup-close-btn"
            onClick={handleClose}
            style={{ backgroundImage: `url(${wrong})` }}
          ></button>
          <div className="form-page">
            <div className="form-wrapper">
              <p className="title">
                Nh???n t?? v???n d???ch v??? ????o t???o t??? CP Learning Center
              </p>
              <p className="sub-title">
                Ch??ng t??i s???n s??ng t?? v???n, ho??n to??n mi???n ph??
              </p>
              {_err && (
                <Alert
                  message="Vui l??ng nh???p ?????y ????? th??ng tin"
                  type="error"
                  showIcon
                />
              )}
              <form onSubmit={submitConsulting}>
                <div className="ifa-form-control">
                  <p className="label">T??n c??ng ty</p>
                  <div className="input-group">
                    <input {...companyName} placeholder="Nh???p t??n c??ng ty" />
                  </div>
                </div>
                <div className="ifa-form-control">
                  <p className="label">H??? t??n*</p>
                  <div className="input-group">
                    <input {...name} placeholder="Nh???p h??? v?? t??n" />
                  </div>
                </div>
                <div className="ifa-form-control">
                  <p className="label">S??? ??i???n tho???i*</p>
                  <div className="input-group">
                    <input {...phone} placeholder="Nh???p s??? ??i???n tho???i" />
                  </div>
                </div>
                <div className="ifa-form-control">
                  <p className="label">Email*</p>
                  <div className="input-group">
                    <input {...email} placeholder="Nh???p email c???a b???n" />
                  </div>
                </div>
                <div className="ifa-form-control ifa-form-control-no-title">
                  <div className="input-group">
                    <textarea placeholder="N???i dung c???n t?? v???n" {...content} />
                  </div>
                </div>
                <div className="ifa-submit-btn">
                  <input type="submit" value="G???i th??ng tin" />
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <UserFooterLayout />
    </>
  )
}

export default MainPage
