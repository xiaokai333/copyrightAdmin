/**
 * Created by liqiang on 17/7/4.
 */
index.controller('artworkListCtrl', ['$scope','getMsg','postJson','IPprefix','$http','$window','userInfo',
    'showModal',
    function($scope,getMsg,postJson,IPprefix,$http,$window,userInfo,showModal){

        //初始化
        $scope.userInfo = userInfo;

        //下拉选项内容
        //$http.get("http://172.16.7.235:8000/copyrights/work/choice").then(function(resp){
        $http.get("http://dev.artally.com.cn/copyrights/work/choice").then(function(resp){
            if(resp.data.code === 0){
                var tag={};
                //作品分类
                //var kind_tag=[
                //    {id:1,text:"艺术品"},
                //    {id:2,text:"摄影"},
                //    {id:3,text:"影视娱乐IP"},
                //    {id:4,text:"动漫"},
                //    {id:5,text:"游戏"}
                //];
                //摄影分类下作品类型
                //var work_types_shoot=[
                //    {id:1,text:"相纸"},
                //    {id:2,text:"数码微喷"}
                //];

                //颜色集合
                var color_tag=[
                    {id:1,text:"#f15246"},
                    {id:2,text:"#ffa626"},
                    {id:3,text:"#ede73d"},
                    {id:4,text:"#2cbf51"},
                    {id:5,text:"#3ac2ce"},
                    {id:6,text:"#3574e6"},
                    {id:7,text:"#803cd9"},
                    {id:8,text:"#cc62c6"},
                    {id:9,text:"#fff"},
                    {id:10,text:"#e6e6e6"},
                    {id:11,text:"#000"},
                    {id:12,text:"#7b4611"}
                ];
                //材质
                //var work_material=[
                //    [
                //        {id:1,text:"布面油画"},
                //        {id:2,text:"布面丙烯"},
                //        {id:3,text:"木板油画"},
                //        {id:4,text:"纸板油画"},
                //        {id:5,text:"蛋彩"},
                //        {id:6,text:"油画棒"},
                //        {id:7,text:"纸上丙烯"},
                //        {id:8,text:"综合材料"},
                //    ],
                //    [
                //        {id:1,text:"绢本水墨"},
                //        {id:2,text:"绢本设色"},
                //        {id:3,text:"纸本设色"},
                //        {id:4,text:"纸本水墨"}
                //    ],
                //    [
                //        {id:1,text:"木刻版画"},
                //        {id:2,text:"铜版画"},
                //        {id:3,text:"石版画"},
                //        {id:4,text:"丝网版画"},
                //        {id:5,text:"综合版画"},
                //        {id:6,text:"数码版画"},
                //        {id:7,text:"水印木刻版画"}
                //    ],
                //    [
                //        {id:1,text:"不锈钢"},
                //        {id:2,text:"玻璃钢"},
                //        {id:3,text:"铜"},
                //        {id:4,text:"石材"},
                //        {id:5,text:"木雕"},
                //        {id:6,text:"水泥"},
                //        {id:7,text:"陶瓷"},
                //        {id:8,text:"泥塑"},
                //        {id:9,text:"3D打印"},
                //        {id:10,text:"雕塑综合材料"},
                //        {id:11,text:"石膏"}
                //    ]
                //]
                tag.style_tag=resp.data.style_tag;
                tag.theme_tag=resp.data.theme_tag;
                tag.work_shapes=resp.data.work_shapes;
                tag.work_types=resp.data.work_categorys.slice(0,7);
                tag.channel_info=resp.data.channel_info;
                tag.print_types=resp.data.print_types;
                tag.color_tag = color_tag;
                tag.kind_tag = resp.data.work_kind;
                tag.work_types_shoot = resp.data.work_categorys.slice(7,9);
                tag.work_material = resp.data.work_materials;
                localStorage.setItem("tag",JSON.stringify(tag));
                $scope.tags = tag;
            }else{
                showModal("alert",resp.data.message,$scope);
            }
        })

        //复选框色系/标签复选框选择获取id
        $scope.selected = [];
        $scope.colorSelected = [];
        $scope.themeSelected = [];
        $scope.styleSelected = [];
        var updateSelected = function(obj,action,id){
            if(action == 'add' && $scope[obj].indexOf(id) == -1){
                $scope[obj].push(id);
            }
            if(action == 'remove' && $scope[obj].indexOf(id)!=-1){
                var idx = $scope[obj].indexOf(id);
                $scope[obj].splice(idx,1);
            }
        }
        $scope.updateSelection = function(obj,$event, id){
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            updateSelected(obj,action,id);
        }
        $scope.isSelected = function(obj,id){
            return $scope[obj].indexOf(id)>=0;
        }

        var material=function(obj){
            var tag=JSON.parse(localStorage.getItem("tag"));
            obj.forEach(function(list){
                if(list.kind == 1 && (list.category == 1 || list.category ==2 || list.category ==3 || list.category ==4)){
                    list.material=tag.work_material[list.material-1].text;
                }else{
                    list.material='未知';
                }
            })
        }
        // 列表数据获取
        getMsg.do('list/work').then(function(resp){
            if(resp.data.code === 0){
                $scope.artworkList=resp.data.data;
                material($scope.artworkList);
            }else{
                showModal("alert",resp.data.message,$scope);
            }
        })
        //全选
        $scope.allChecked=function(flag){
            if(flag){
                $scope.artworkList.forEach(function(x){
                    $scope.selected.push(x.id);
                })
            }else{
                $scope.selected=[];
            }
        }
        //删除按钮
        $scope.delArtwork=function(){
            var selected=$scope.selected.join(",");
            if(!selected){
                // 设置alert弹框
                let title='请选择要删除的艺术家档案！'
                showModal('alert',title,$scope)
                return;
            }
            // 设置confim弹框
            var tit='删除艺术家信息会造成对应艺术家的艺术品版权信息失效，确认删除？'
                // 确认删除按钮
                $scope.yes=function(){
                    var works={
                        work_ids:selected
                    };
                    postJson.do('delete/work',works).then(function(resp){
                        if(resp.data.code===0){
                            $('#myModal').modal('hide')
                            $scope.artworkList=resp.data.data;
                        }else{
                            showModal("alert",resp.data.message,$scope);
                        }
                    })
                }
            showModal('confirm',tit,$scope)
        }
        // 打印按钮
        $scope.print=function(){
            var selected=$scope.selected.join(",");
            if(!selected){
                // 设置alert弹框
                let title='请选择要打印的艺术品！'
                showModal('alert',title,$scope)
                return;
            }
            // 设置confim弹框
            var tit='打印艺术品信息会导出Excel表格，确认打印?'
            // 确认打印按钮
            $scope.yes=function(){
                var works={
                    category:'work',
                    ids:selected
                };
                postJson.do('export/excel',works).then(function(resp){
                    if(resp.data.code === 0){
                        $('#myModal').modal('hide')
                        $window.open(resp.data.path);
                    }else{
                        showModal("alert",resp.data.message,$scope);
                    }
                })
            }
            showModal('confirm',tit,$scope)
        }
        //搜索
        $scope.search = function(searchText,searchKind,searchShape){
            if(searchText != undefined || searchKind != undefined || searchShape != undefined || $scope.colorSelected.length > 0 || $scope.themeSelected.length > 0 || $scope.styleSelected.length > 0){
                var info={
                    search:searchText,
                    kind:searchKind,
                    shape:searchShape,
                    theme:$scope.themeSelected.join(","),
                    style:$scope.styleSelected.join(","),
                    color:$scope.colorSelected.join(",")
                }
                $http(
                    {method:'GET',url:IPprefix+"list/work",params:info}
                ).then(function(resp){
                    if(resp.data.code === 0){
                        $scope.artworkList=resp.data.data;
                        material($scope.artworkList);
                    }else{
                        showModal("alert",resp.data.message,$scope);
                    }
                })
            }
        };
        //清空搜索
        $scope.clear=function(searchText,searchKind,searchShape){
            if(searchText != undefined || searchKind != undefined || searchShape != undefined || $scope.colorSelected.length > 0 || $scope.themeSelected.length > 0 || $scope.styleSelected.length > 0) {
                $window.location.reload();
            }
        }
        // 取消按钮
        $scope.no=function(){
            $('#myModal').modal('hide')
        }

    }])