/**
 * Created by liqiang on 17/7/4.
 */
index.controller('artworkMsgCtrl',['$scope','$stateParams','getMsg','$http','IPprefix','$state','postJson','$location',
    'showModal',
    function($scope,$stateParams,getMsg,$http,IPprefix,$state,postJson,$location,showModal){

        //初始化
        var artworkId = $stateParams['artworkId'];
        $scope.save = false;
        $scope.artworkId=artworkId;
        var keys = ['name', 'artist', 'year','kind','category','material','shape','is_variable',
            'width', 'height', 'length', 'color', 'tag','sale_state',
            'sale_direc', 'comm_precent', 'store_state', 'store', 'summary','exhibit_log'
        ];
        var sendData=new FormData();
        $scope.artwork={};
        $scope.title="创建";
        //获取选项内容
        var tag = JSON.parse(localStorage.getItem("tag"));
        $scope.kind_tag=tag.kind_tag;
        $scope.color_tag=tag.color_tag;
        $scope.style_tag=tag.style_tag;
        $scope.theme_tag=tag.theme_tag;
        $scope.work_material=tag.work_material;
        $scope.work_shapes=tag.work_shapes;
        $scope.work_types=tag.work_types;
        $scope.work_types_shoot=tag.work_types_shoot;

        // 作品图片选择事件
        $scope.updateHead=function(files){
            $scope.coverPic=files[0];
            let reader = new FileReader();   //创建一个FileReader接口
            reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
            reader.onload = function(ev) {
                $scope.$apply(function(){
                    $scope.artwork.cover = ev.target.result; // img接收
                });
            };
        }
        //输入作者名字必须根据推荐
        $scope.isSearch = false;
        $scope.searchName=function(text){
            $http(
                {method:'GET',url:IPprefix+"search/artist",params:{search:text}}
            ).then(function(resp){
                if(resp.data.code === 0){
                    $scope.artistList=resp.data.data;
                    if($scope.artistList.length > 0){
                        $scope.isSearch = true;
                    }else{
                        $scope.isSearch = false;
                    }
                }else{
                    showModal("alert",resp.data.message,$scope);
                }
            })
        }
        $scope.updateName=function($event){
            $scope.artistName = $event.target.label;
            $scope.isSearch = false;
        }

        //通过所选作品分类判断类型/材质的选项内容
        function checkKind(){
            if($scope.artwork.kind == 1){
                console.log(1)
            }else if($scope.artwork.kind == 2){
                console.log(2)
            }
        }
        checkKind();

        //色系/标签复选框选择获取id
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

        //判断年代
        $scope.yearMax=new Date().getFullYear();

        //判断输入信息
        var checkInfo=function(){
            //尺寸
            if($scope.artwork.is_variable==1){
                $scope.artwork.width=0;
                $scope.artwork.height=0;
                $scope.artwork.length=0;
            }
            //销售状态
            if($scope.artwork.sale_state !== 1){
                $scope.artwork.sale_direc=1;
                $scope.artwork.sale_price=0;
                $scope.artwork.comm_precent=0;
            }else{
                if($scope.artwork.sale_direc !== 1){
                    $scope.artwork.sale_price=0;
                    $scope.artwork.comm_precent=0;
                }
            }
            //收藏状态
            if($scope.artwork.store_state!==3){
                $scope.artwork.store='';
            }
            //分类,类型,形状
            if(typeof ($scope.artwork.artist)=="undefined" || typeof ($scope.artwork.kind)=="undefined" || typeof ($scope.artwork.shape)=="undefined"){
                var title = "请检查作品信息是否填写完整";
                showModal('alert',title,$scope);
                $scope.checkd=false;
            }
            //材质
            if($scope.artwork.kind == 1 && ($scope.artwork.category == 1 || $scope.artwork.category ==2 || $scope.artwork.category ==3 || $scope.artwork.category == 4)){
                if(typeof ($scope.artwork.material)=="undefined" || $scope.artwork.material == null){
                    var title = "请检查作品信息是否填写完整";
                    showModal('alert',title,$scope);
                    $scope.checkd=false;
                }
            }

            //标签数据由数组转换为字符串
            $scope.artwork.color = $scope.colorSelected.join(",");
            $scope.artwork.theme_tag = $scope.themeSelected.join(",");
            $scope.artwork.style_tag = $scope.styleSelected.join(",");
            $scope.artwork.tag=$scope.artwork.theme_tag=="" ? $scope.artwork.style_tag : $scope.artwork.theme_tag + "," + $scope.artwork.style_tag;
            $scope.checkd=true;

            //formdata对象添加值
            function modelToFormData(fd,model,keys){
                var value;
                for (var i = keys.length - 1; i >= 0; i--) {
                    value = model[keys[i]];
                    if (typeof value == 'object') {
                        value = JSON.stringify(value);
                    }
                    if (value != null && value != 'null' && value != undefined) {
                        fd.append(keys[i], value);
                    }
                }
            }
            modelToFormData(sendData,$scope.artwork,keys);
        }

        //获取单个艺术品信息
        if(!(artworkId === 'NaN')){
            $scope.title="编辑";
            getMsg.do("work/detail/"+artworkId).then(function(resp){
                if(resp.data.code === 0){
                    $scope.artwork=resp.data.data;
                    $scope.artistName=$scope.artwork.artist_name;
                    //标签数据由字符串转换为数组
                    resp.data.data.color.split(",").forEach(function(color){
                        var colorid=Number(color);
                        $scope.colorSelected.push(colorid);
                    })
                    resp.data.data.theme_tag.split(",").forEach(function(theme){
                        var themeid=Number(theme);
                        $scope.themeSelected.push(themeid);
                    })
                    resp.data.data.style_tag.split(",").forEach(function(style){
                        var styleid=Number(style);
                        $scope.styleSelected.push(styleid);
                    })
                }else{
                    showModal("alert",resp.data.message,$scope);
                }
            })
            //更新艺术品数据
            $scope.artworkSave=function(){
                checkInfo();
                //图片单独追加
                if($scope.coverPic != ''){
                    sendData.append("cover",$scope.coverPic);
                }else{
                    sendData.append("cover",$scope.artwork.cover);
                }
                if($scope.checkd) {
                    $http({
                        method:'POST',
                        url:IPprefix+"update/work/"+artworkId,
                        data: sendData,
                        headers: {'Content-Type':undefined},
                        transformRequest: angular.identity
                    }).then(function(resp){
                        if(resp.data.code === 0){
                            $location.path("/tabs/artwork/list");
                        }else{
                            showModal("alert",resp.data.message,$scope);
                            return;
                        }
                    })
                }
            }
        }else{
            //创建艺术品
            $scope.artworkSave=function(){
                checkInfo();
                //图片单独追加
                sendData.append("cover",$scope.coverPic);
                if($scope.checkd){
                    $scope.save = true;
                    $http({
                        method:'POST',
                        url:IPprefix+"add/work/",
                        data: sendData,
                        headers: {'Content-Type':undefined},
                        transformRequest: angular.identity
                    }).then(function(resp){
                        if(resp.data.code === 0){
                            //$location.path("/tabs/artwork/accredit/"+resp.data.work_id);
                            $location.path("/tabs/artwork/list");
                        }else{
                            showModal("alert",resp.data.message,$scope);
                        }
                    })
                }
            }
        }

        // 模态框取消按钮
        $scope.no=function(){
            $('#myModal').modal('hide')
        }
}])