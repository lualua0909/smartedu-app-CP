import React, { useState, useEffect } from 'react'
import axios from 'helpers/axios'
import ListPageHeading from 'containers/ListPageHeading'
import AddNewModal from 'containers/courseGroup/addAndEdit'
import CourseGroup from 'containers/courseGroup/listData'
import { Spin } from 'antd'

const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i
    }
  }
  return -1
}

const orderOptions = [
  { column: 'name', label: 'Tên danh mục' },
  { column: 'id-desc', label: 'Ngày tạo mới nhất' },
  { column: 'id-asc', label: 'Ngày tạo cũ nhất' },
]

const CourseGroupPage = ({ match, ...props }) => {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrderOption, setSelectedOrderOption] = useState({ column: 'id', label: 'Ngày tạo' })

  const [modalOpen, setModalOpen] = useState(false)
  const [addNewFlag, setAddNewFlag] = useState(false)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedItems, setSelectedItems] = useState([])
  const [items, setItems] = useState([])
  const [lastChecked, setLastChecked] = useState(null)

  useEffect(() => {
    const editId = new URLSearchParams(props.location.search).get("p")
    if (editId) {
      setEditId(editId)
      setModalOpen(true)
    }
  }, [props.location.search])

  useEffect(() => {
    const fetchData = () => {
      setLoading(true)
      axios
        .get('admin/course-groups/paging', {
          params: {
            orderBy: selectedOrderOption.column,
            search
          }
        })
        .then(res => {
          return res.data
        })
        .then(data => {
          setItems(data)
          setSelectedItems([])
        })
        .finally(() => setLoading(false))
    }
    fetchData()
  }, [selectedOrderOption, search])

  const onCheckItem = (event, id) => {
    if (
      event.target.tagName === 'A' ||
      (event.target.parentElement && event.target.parentElement.tagName === 'A')
    ) {
      return true
    }
    if (lastChecked === null) {
      setLastChecked(id)
    }

    let selectedList = [...selectedItems]
    if (selectedList.includes(id)) {
      selectedList = selectedList.filter((x) => x !== id)
    } else {
      selectedList.push(id)
    }
    setSelectedItems(selectedList)

    if (event.shiftKey) {
      let newItems = [...items]
      const start = getIndex(id, newItems, 'id')
      const end = getIndex(lastChecked, newItems, 'id')
      newItems = newItems.slice(Math.min(start, end), Math.max(start, end) + 1)
      selectedItems.push(
        ...newItems.map(item => {
          return item.id
        })
      )
      selectedList = Array.from(new Set(selectedItems))
      setSelectedItems(selectedList)
    }
    document.activeElement.blur()
    return false
  }

  const removeDatas = () => {
    const selectedCourseGroups = selectedItems
    axios.post('admin/course-groups/delete', { selectedCourseGroups })
      .then(res => {
        if (res.data.status === 200) {
          const newItems = items.filter(i => !selectedItems.some(j => i.id === j))
          setItems(newItems)
        }
      })
  }

  const handleChangeSelectAll = (isToggle) => {
    if (selectedItems.length >= items.length) {
      if (isToggle) {
        setSelectedItems([])
      }
    } else {
      setSelectedItems(items.map((x) => x.id))
    }
    document.activeElement.blur()
    return false
  }

  const onContextMenuClick = (e, data) => {
    if (data.action === 'delete') {
      removeDatas()
    } else if (data.action === 'edit') {
      props.history.push('/app/managers/course-groups?p=' + selectedItems[0])
    }
  }

  const onContextMenu = (e, data) => {
    const clickedProductId = data.data
    if (!selectedItems.includes(clickedProductId)) {
      setSelectedItems([clickedProductId])
    }
    return true
  }

  const toggleModal = () => {
    if (modalOpen) {
      props.history.push('/app/managers/course-groups')
    }
    setAddNewFlag(!modalOpen)
    setModalOpen(!modalOpen)
  }

  const appendNew = data => {
    setItems([data, ...items])
  }

  const editData = item => {
    const newItems = [...items]
    var foundIndex = newItems.findIndex(x => parseInt(x.id) === parseInt(item.id))
    newItems[foundIndex] = item
    setItems(newItems)
  }

  return <Spin spinning={loading}>
    <div className="disable-text-selection">
      <ListPageHeading
        hideViewType={true}
        heading="managers.groups"
        handleChangeSelectAll={handleChangeSelectAll}
        changeOrderBy={column => {
          setSelectedOrderOption(
            orderOptions.find(x => x.column === column)
          )
        }}
        selectedOrderOption={selectedOrderOption}
        match={match}
        selectedItemsLength={selectedItems ? selectedItems.length : 0}
        itemsLength={items ? items.length : 0}
        onSearchKey={(e) => {
          if (e.key === 'Enter') {
            setSearch(e.target.value.toLowerCase())
          }
        }}
        removeSelected={removeDatas}
        orderOptions={orderOptions}
        toggleModal={toggleModal}
      />
      <AddNewModal
        modalOpen={modalOpen}
        toggleModal={toggleModal}
        editId={editId}
        addNewFlag={addNewFlag}
        addNew={appendNew}
        editData={editData}
      />
      <CourseGroup
        items={items}
        selectedItems={selectedItems}
        onCheckItem={onCheckItem}
        currentPage={currentPage}
        onContextMenuClick={onContextMenuClick}
        onContextMenu={onContextMenu}
        onChangePage={setCurrentPage}
      />
    </div>
  </Spin>

}

export default CourseGroupPage