/**
 * Created by liqiang on 17/7/4.
 */
index.controller('artworkDetailCtrl',['$scope','$stateParams','getMsg','userInfo','showModal','$rootScope',
    function($scope,$stateParams,getMsg,userInfo,showModal,$rootScope){

        //初始化
        $scope.userInfo = userInfo;
        var artwotkId=$stateParams['artworkId'];
        //获取选项内容
        var tag = JSON.parse(localStorage.getItem("tag"));
        $scope.work_types = tag.work_types;
        $scope.work_shapes =tag.work_shapes;
        $scope.work_color_tag=tag.color_tag;
        $scope.work_style_tag=tag.style_tag;
        $scope.work_theme_tag=tag.theme_tag;

        //获取对应详情数据
        getMsg.do("work/all/info/"+artwotkId).then(function(resp){
            if(resp.data.code === 0){
                $scope.artwork=resp.data.work_data;
                $scope.authorize=resp.data.authorize_data;
                if($scope.artwork.authorize_body != null){
                    $scope.authorize_body = $scope.artwork.authorize_body.split(',');
                }

                    //材质
                    if($scope.artwork.kind == 1 && ($scope.artwork.category == 1 || $scope.artwork.category ==2 || $scope.artwork.category ==3 || $scope.artwork.category ==4)){
                        $scope.artwork.material=tag.work_material[$scope.artwork.category-1][$scope.artwork.material-1].text;
                    }else{
                        $scope.artwork.material = "未知";
                    }
                //作品分类
                switch ($scope.artwork.kind){
                    case(1):
                        $scope.artwork.kind = '艺术品';
                        //作品类别
                        $scope.artwork.category = tag.work_types[$scope.artwork.category-1].text;
                        break;
                    case(2):
                        $scope.artwork.kind = '摄影';
                        //作品类别
                        $scope.artwork.category = tag.work_types_shoot[$scope.artwork.category-1].text;
                        break;
                }
                //画作形状
                $scope.artwork.shape = tag.work_shapes[$scope.artwork.shape-1].text;

                //标签
                $scope.colorFlag={};
                $scope.themeFlag={};
                $scope.styleFlag={};
                $scope.work_color_tag.forEach(function (color) {
                    var colorTagId=color.id;
                    //标签数据由字符串转换为数组
                    $scope.artwork.color.split(",").forEach(function(color){
                        var colorid=Number(color);
                        if(colorid == colorTagId){
                            $scope.colorFlag[colorid]=true;
                        }
                    })
                })
                $scope.work_theme_tag.forEach(function (theme) {
                    var themeTagId=theme.id;
                    //标签数据由字符串转换为数组
                    $scope.artwork.theme_tag.split(",").forEach(function(theme){
                        var themeid=Number(theme);
                        if(themeid == themeTagId){
                            $scope.themeFlag[themeid]=true;
                        }
                    })
                })
                $scope.work_style_tag.forEach(function (style) {
                    var styleTagId=style.id;
                    //标签数据由字符串转换为数组
                    $scope.artwork.style_tag.split(",").forEach(function(style){
                        var styleid=Number(style);
                        if(styleid == styleTagId){
                            $scope.styleFlag[styleid]=true;
                        }
                    })
                })

                //销售状态
                switch ($scope.artwork.sale_state){
                    case(1):
                        $scope.artwork.sale_state = '待售';
                        //销售渠道
                            switch ($scope.artwork.sale_direc){
                                case(1):
                                    $scope.artwork.sale_direc = '艺术云朵';
                                    break;
                                case(2):
                                    $scope.artwork.sale_direc = '其他渠道';
                                    break;
                            }
                        break;
                    case(2):
                        $scope.artwork.sale_state = '已售';
                        break;
                    case(3):
                        $scope.artwork.sale_state = '非卖';
                        break;
                }
                //收藏状态
                switch ($scope.artwork.store_state){
                    case(1):
                        $scope.artwork.store_state = '艺术家自藏';
                        break;
                    case(2):
                        $scope.artwork.store_state = '私人自藏';
                        break;
                    case(3):
                        $scope.artwork.store_state = '其他收藏';
                        break;
                }
            }else{
                showModal("alert","获取艺术品详情失败",$scope)
            }
        })
}])