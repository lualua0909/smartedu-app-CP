import styled from 'styled-components'
import up from 'atoms/course-contents/up.svg'
import wrong from 'atoms/course-contents/wrong.svg'
import correct from 'atoms/course-contents/correct.svg'
import test from 'atoms/course-contents/test.svg'
import time from 'atoms/course-contents/time.svg'

export default styled.div`
border: 1px solid #eee;
display: none;
background: #ffffff;
border-radius: 0px 10px 10px 0px;
padding: 20px 20px 20px 20px;
margin-top: 15px;
margin-right: 11px;
position: relative;
max-height: 760px;
box-shadow: 2px 6px 30px rgba(78, 82, 92, 0.1);
p {
  font-weight: bold;
  font-size: 24px;
  line-height: 140%;
  letter-spacing: 0.01em;
  color: #000;
}
.list .curriculum-item {
  margin-top: 12.5px;
}
.list .curriculum-item:first-child {
  margin-top: 16.5px;
}
.list .curriculum-item .curriculum-item-header {
  padding: 15px 12px;
  font-weight: bold;
  font-size: 16px;
  line-height: 160%;
  letter-spacing: 0.01em;
  color: #091230;
  width: 330px;
  height: 56px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  background-color: #f7f8ff;
  border: 1px solid #091230;
  position: relative;
  cursor: pointer;
}
.list .curriculum-item .curriculum-item-header::after {
  content: '';
  width: 25px;
  height: 25px;
  background-image: url(${up});
  transform: rotate(-180deg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 25px;
  position: absolute;
  right: 12px;
  top: calc(50% - 12.5px);
  transition: transform 550ms ease;
  -moz-transition: -moz-transform 550ms ease;
  -ms-transition: -ms-transform 550ms ease;
  -o-transition: -o-transform 550ms ease;
  -webkit-transition: -webkit-transform 550ms ease;
}
.list .curriculum-item.active .curriculum-item-header::after {
  transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  transition: transform 550ms ease;
  -moz-transition: -moz-transform 550ms ease;
  -ms-transition: -ms-transform 550ms ease;
  -o-transition: -o-transform 550ms ease;
  -webkit-transition: -webkit-transform 550ms ease;
}
.list .curriculum-item .curriculum-item-body {
  display: none;
}
.list .curriculum-item.active .curriculum-item-body {
  display: block;
}
.list .curriculum-item .curriculum-item-body a {
  font-weight: 600;
  font-size: 14px;
  line-height: 140%;
  letter-spacing: 0.01em;
  color: #363e57;
  display: block;
  border: 1px solid #e1e5f1;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  margin-top: 10px;
  padding: 11px 12px;
  position: relative;
  width: 330px;
}
.list .curriculum-item .curriculum-item-body a.finish {
  color: #091230;
  padding: 10.75px 35px;
}
.list .curriculum-item .curriculum-item-body a.finish::before {
  position: absolute;
  content: '';
  background-image: url(${correct});
  background-repeat: no-repeat;
  background-position: left 5px center;
  background-size: 24px;
  width: 24px;
  height: 24px;
  left: 0;
  top: calc(50% - 12px);
}
.list .curriculum-item .curriculum-item-body a.current-lecture {
  color: #091230;
  padding: 10.75px 35px;
}
.list .curriculum-item .curriculum-item-body a.current-lecture::before {
  position: absolute;
  content: '';
  background-image:url("data:image/gif;base64,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") !important;
  background-repeat: no-repeat;
  background-position: left 5px center;
  background-size: 28px;
  width: 32px;
  height: 24px;
  left: 0;
  top: calc(50% - 12px);
}
.list .curriculum-item .curriculum-item-body a.processing,
.list .curriculum-item .curriculum-item-body a:hover {
  background-color: #f2f2f2;
}
.list .curriculum-item .curriculum-item-body a.processing {
  pointer-events: none;
  cursor: default;
}
.list .curriculum-item .curriculum-item-body a.exam,
.list .curriculum-item .curriculum-item-body a.time {
  padding-right: 39px;
}
.list .curriculum-item .curriculum-item-body a.exam::after,
.list .curriculum-item .curriculum-item-body a.time::after {
  position: absolute;
  content: '';
  background-repeat: no-repeat;
  background-position: right 5px center;
  background-size: 24px;
  width: 25px;
  height: 25px;
  right: 10px;
  top: calc(50% - 12px);
}
.list .curriculum-item .curriculum-item-body a.exam::after {
  background-image: url(${test});
}
.list .curriculum-item .curriculum-item-body a.time::after {
  background-image: url(${time});
}
.hide-menu-left {
  display: block;
  position: absolute;
  background-image: url(${wrong});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 25px 28px;
  position: absolute;
  right: 12px;
  top: 28px;
  width: 25px;
  height: 28px;
}
`