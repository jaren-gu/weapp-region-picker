//省市区数据数组，读取自 cityDataArr.js，也可以通过网络读取 cityDataArr.json
let areaData = require('./cityDataArr.js').data

Page({
    data: {
        customAreaData: [],
        // 自定义选项
        customItem: '全部',
        // 已选中的项目下标，默认是所有列的第一项
        selectedRegion: [0, 0, 0],
        pickerRange: [],
    },
    onLoad() {
        const customAreaData = this.appendCustomItem()
        this.setData({
            customAreaData: customAreaData,
            pickerRange: [customAreaData, customAreaData[0].citys, customAreaData[0].citys[0].areas],
        })
    },

    /**
     * 为省市区数据追加 customItem
     */
    appendCustomItem() {
        let customAreaData = [...areaData]
        customAreaData.forEach((province) => {
            province.citys = [
                {
                    areas: [],
                    code: '',
                    level: 0,
                    name: this.data.customItem,
                    parent: '',
                },
                ...province.citys,
            ]

            province.citys.forEach((city) => {
                city.areas = [
                    {
                        code: '',
                        level: 0,
                        name: this.data.customItem,
                        parent: '',
                    },
                    ...city.areas,
                ]
            })
        })
        customAreaData = [
            {
                citys: [
                    {
                        areas: [
                            {
                                code: '',
                                level: 0,
                                name: this.data.customItem,
                                parent: '',
                            },
                        ],
                        code: '',
                        level: 0,
                        name: this.data.customItem,
                        parent: '',
                    },
                ],
                code: '',
                level: 0,
                name: this.data.customItem,
            },
            ...customAreaData,
        ]

        return customAreaData
    },

    /**
     * 用于监听组件值变化
     * @param e
     */
    multiPickerChange(e) {
        const region = e.detail.value
        // 获取当前选中的省市区数据
        // const province = areaData[region[0]]
        // const city = province.citys[region[1]]
        // const district = city.areas[region[2]]
    },

    /**
     * 用于监听组件列变化，实现省市区联动
     * @param e
     */
    multiPickerColumnChange(e) {
        const customAreaData = [...this.data.customAreaData]
        let data = {
            pickerRange: [...this.data.pickerRange], //默认加载所有列的第一项
            selectedRegion: [...this.data.selectedRegion], //加载变动前已选中的各列下标
        }
        data.selectedRegion[e.detail.column] = e.detail.value // 更改列数据
        if (e.detail.column == 0) {
            data.selectedRegion = [e.detail.value, 0, 0]
        } else if (e.detail.column == 1) {
            data.selectedRegion = [data.selectedRegion[0], e.detail.value, 0]
        } else if (e.detail.column == 2) {
            data.selectedRegion = [data.selectedRegion[0], data.selectedRegion[1], e.detail.value]
        }

        data.pickerRange[0] = customAreaData
        if (customAreaData[data.selectedRegion[0]].citys.length > 0) {
            data.pickerRange[1] = customAreaData[data.selectedRegion[0]].citys
            data.pickerRange[2] = customAreaData[data.selectedRegion[0]].citys[data.selectedRegion[1]].areas
        }

        // data.pickerRange 为当前 picker 组件最新的 range
        // data.selectedRegion 为当前 picker 组件最新的 value
        this.setData({
            pickerRange: data.pickerRange,
            selectedRegion: data.selectedRegion,
        })
    },
})
