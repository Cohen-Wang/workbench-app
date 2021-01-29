setTimeout(() => {
  // tables 为一个数组, 如果有多个子表, 就多写几个
  // keysToExclude 为只读/必填字段, 是为了解决保存表单之后，数据会变为原来的data里面的初始数据, 所以要排除表单内已经有数据的key对应的数据
  // 其实主要解决的就是 新建表单的时候用下面的数据, 编辑表单的时候不用下面的初始数据
  const tables = [
    {
      'tableName': 'regular_weekly_work_a_1',
      'data': [
        { 'device_name': '韩明亮1', 'quality_standard': '质量标准1' },
        { 'device_name': '韩明亮2', 'quality_standard': '质量标准2' },
        { 'device_name': '韩明亮3', 'quality_standard': '质量标准3' },
        { 'device_name': '韩明亮4', 'quality_standard': '质量标准4' },
        { 'device_name': '韩明亮5', 'quality_standard': '质量标准5' },
        { 'device_name': '韩明亮6', 'quality_standard': '质量标准6' },
        { 'device_name': '韩明亮7', 'quality_standard': '质量标准7' },
        { 'device_name': '韩明亮8', 'quality_standard': '质量标准8' },
        { 'device_name': '韩明亮9', 'quality_standard': '质量标准9' },
        { 'device_name': '韩明亮10', 'quality_standard': '质量标准10' }
      ],
      'keysToExclude': ['device_name', 'quality_standard']
    },
    {
      'tableName': 'regular_weekly_work_a_2',
      'data': [
        { 'device_name': '彭福祥1', 'inspection_results': '检查结果1' },
        { 'device_name': '彭福祥2', 'inspection_results': '检查结果2' },
        { 'device_name': '彭福祥3', 'inspection_results': '检查结果3' },
        { 'device_name': '彭福祥4', 'inspection_results': '检查结果4' },
        { 'device_name': '彭福祥5', 'inspection_results': '检查结果5' }
      ],
      'keysToExclude': ['device_name', 'inspection_results']
    },
    {
      'tableName': 'regular_weekly_work_a_3',
      'data': [
        { 'device_name': '甘杨1' },
        { 'device_name': '甘杨2' },
        { 'device_name': '甘杨3' },
        { 'device_name': '甘杨4' }
      ],
      'keysToExclude': ['device_name']
    }]
  tables.forEach(eachTable => {
    const keyName = 'sub-table-design_' + eachTable.tableName
    const originData = JSON.parse(decodeURIComponent(api.getFormData(keyName))) || []
    const newData = originData.map((eachOriginData, index) => {
      eachTable.keysToExclude = eachTable.keysToExclude || []
      eachTable.keysToExclude.forEach(eachKey => {
        delete eachOriginData[eachKey]
      })
      return Object.assign({}, eachTable.data[index] || {}, eachOriginData)
    })
    api.setFormData(keyName, encodeURIComponent(JSON.stringify(newData)))
  })
}, 1000)
