import React, { useState, useEffect } from 'react'
import axios from 'helpers/axios'
import ListPageHeading from 'containers/ListPageHeading'
import AddNewModal from 'containers/partners/addAndEdit'
import Partners from 'containers/partners/listData'
import { Spin, message } from 'antd'

const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i
    }
  }
  return -1
}

const orderOptions = [
  { column: 'name-desc', label: 'Tên nhóm người dùng A-Z' },
  { column: 'name-asc', label: 'Tên nhóm người dùng Z-A' },
  { column: 'id-desc', label: 'Ngày tạo mới nhất' },
  { column: 'id-asc', label: 'Ngày tạo cũ nhất' },
]
const pageSizes = [4, 8, 12, 20]

const PartnersPage = ({ match, ...props }) => {

  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPageSize, setSelectedPageSize] = useState(8)
  const [selectedOrderOption, setSelectedOrderOption] = useState({ column: 'id', label: 'Ngày tạo' })

  const [modalOpen, setModalOpen] = useState(false)
  const [addNewFlag, setAddNewFlag] = useState(false)
  const [editId, setEditId] = useState(null)
  const [totalItemCount, setTotalItemCount] = useState(0)
  const [totalPage, setTotalPage] = useState(1)
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
    setCurrentPage(1)
  }, [selectedPageSize, selectedOrderOption])

  useEffect(() => {
    const fetchData = () => {
      setLoading(true)
      axios
        .get('admin/partners/paging', {
          params: {
            pageSize: selectedPageSize,
            currentPage,
            orderBy: selectedOrderOption.column,
            search
          }
        })
        .then(res => {
          return res.data
        })
        .then(data => {
          setTotalPage(Math.ceil(data.totalItem / selectedPageSize))
          setItems(data)
          setSelectedItems([])
          setTotalItemCount(data.totalItem)
        })
        .finally(() => setLoading(false))
    }
    fetchData()
  }, [selectedPageSize, currentPage, selectedOrderOption, search])

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
      selectedList = selectedList.filter(x => x !== id)
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
        ...newItems.map((item) => {
          return item.id
        })
      )
      selectedList = Array.from(new Set(selectedItems))
      setSelectedItems(selectedList)
    }
    document.activeElement.blur()
    return false
  }

  const removeSelected = () => {

    axios
      .post('admin/partners/delete', {
        selected: selectedItems
      })
      .then(res => {
        setItems(items.filter(item => !selectedItems.includes(item.id)))
        message.success('Xóa nhóm người dùng thành công')
      })
      .catch(error => {
        message.error('Xóa nhóm người dùng thất bại')
        return error.message
      })
  }

  const handleChangeSelectAll = isToggle => {
    if (selectedItems.length >= items.length) {
      if (isToggle) {
        setSelectedItems([])
      }
    } else {
      setSelectedItems(items.map(x => x.id))
    }
    document.activeElement.blur()
    return false
  }

  const onContextMenuClick = (e, data) => {
    // params : (e,data,target)
    if (data.action === 'delete') {
      removeSelected()
    } else if (data.action === 'edit') {
      props.history.push('/app/users/partners?p=' + selectedItems[0])
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
      props.history.push('/app/users/partners')
    }
    setAddNewFlag(!modalOpen)
    setModalOpen(!modalOpen)
  }

  const appendNew = data => {
    setTotalItemCount(totalItemCount + 1)
    setTotalPage(Math.ceil(totalItemCount / selectedPageSize))
    setItems([data, ...items])
  }

  const editPartner = data => {
    const newItems = [...items]
    newItems[newItems.findIndex(x => x.id.toString() === data.id.toString())] = data
    setItems(newItems)
  }

  const startIndex = (currentPage - 1) * selectedPageSize
  const endIndex = currentPage * selectedPageSize

  return <Spin spinning={loading} tip="Loading...">
    <div className="disable-text-selection">
      <ListPageHeading
        hideViewType={true}
        heading="managers.partners"
        handleChangeSelectAll={handleChangeSelectAll}
        changeOrderBy={column => {
          setSelectedOrderOption(
            orderOptions.find(x => x.column === column)
          )
        }}
        changePageSize={setSelectedPageSize}
        selectedPageSize={selectedPageSize}
        totalItemCount={totalItemCount}
        selectedOrderOption={selectedOrderOption}
        match={match}
        startIndex={startIndex}
        endIndex={endIndex}
        selectedItemsLength={selectedItems ? selectedItems.length : 0}
        itemsLength={items ? items.length : 0}
        onSearchKey={e => {
          if (e.key === 'Enter') {
            setSearch(e.target.value.toLowerCase())
          }
        }}
        removeSelected={removeSelected}
        orderOptions={orderOptions}
        pageSizes={pageSizes}
        toggleModal={toggleModal}
      />
      <AddNewModal
        modalOpen={modalOpen}
        toggleModal={toggleModal}
        editId={editId}
        addNewFlag={addNewFlag}
        addNew={appendNew}
        editPartner={editPartner}
      />
      <Partners
        items={items}
        selectedItems={selectedItems}
        onCheckItem={onCheckItem}
        currentPage={currentPage}
        totalPage={totalPage}
        onContextMenuClick={onContextMenuClick}
        onContextMenu={onContextMenu}
        onChangePage={setCurrentPage}
      />
    </div>
  </Spin>

}

export default React.memo(PartnersPage)