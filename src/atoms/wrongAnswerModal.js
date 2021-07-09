import React, { memo } from 'react'
import wrong from 'atoms/course-contents/wrong.png'
import styled from 'styled-components'
import Modal from 'react-bootstrap/Modal'

export default memo(({ modal, closeModal, customBtn = null }) =>
    <CustomModal
        show={modal}
        onHide={closeModal}
        animation={true}
        centered
        size="lg"
    ><Modal.Body>
            <i className="icon-complete" />
            <h3 className="title">Tiếc quá !<br />Câu trả lời chưa chính xác</h3>
            {customBtn || null}
        </Modal.Body>
    </CustomModal>
)

const CustomModal = styled(Modal)`
  .modal-content {
    border:none;
    border-radius: 20px;
  }
  .modal-body {
    padding: 64px 14px;
    max-width: 770px;
    text-align: center;
    @media only screen and (min-width: 992px) {
      padding: 60px;
    }
    .icon-complete {
      display: block;
      height: 142px;
      background:  url(${wrong});
      background-position: center;
    background-size: contain;
    background-repeat: no-repeat
    }
    .title {
      margin: 40px -10px 0;
      margin-bottom: 0;
      color: #193769;
      letter-spacing: 0.01em;
      font-size: 22px;
      font-weight: bold;
      line-height: 130%;
      @media only screen and (min-width: 992px) {
        font-size: 32px;
      }
    }
  }
`