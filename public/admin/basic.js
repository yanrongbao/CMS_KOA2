/**
 * Created by Administrator on 2018/3/24 0024.
 */
$(function() {
  app.comfirmDelete()
})
var app = {
  toggle: function(el, collectionName, attr, id) {
    $.get(
      '/admin/changeStatus',
      { collectionName: collectionName, attr: attr, id: id },
      function(data) {
        if (data.success) {
          if (el.src.indexOf('yes') != -1) {
            el.src = '/admin/images/no.gif'
          } else {
            el.src = '/admin/images/yes.gif'
          }
        }
      }
    )
  },
  comfirmDelete: function() {
    $('.delete').click(function() {
      var flag = confirm('你确定要删除吗?')
      return flag
    })
  },
  changeSort(el, collectionName, id) {
    let value = el.value
    $.get(
      '/admin/changeSort',
      { collectionName: collectionName, id: id, value: value },
      function(data) {}
    )
  }
}
