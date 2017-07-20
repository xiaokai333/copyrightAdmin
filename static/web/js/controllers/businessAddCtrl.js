/**
 * Created by liqiang on 17/7/4.
 */
index.controller('businessAddCtrl', ['$scope','getMsg','postJson','$http','IPprefix','$state','showModal',
    function($scope,getMsg,postJson,$http,IPprefix,$state,showModal){

        //初始化
        $scope.save = false;
        $scope.business={};
        $scope.affirm=false;
        //查找编号对应信息
        $scope.find=function(id){
            $http(
                {method:'GET',url:IPprefix+"business/search/apply",params:{apply_number:id}}
            ).then(function (resp) {
                if(resp.data.code === 0){
                    $scope.affirm=true;
                    $scope.artwork=resp.data;
                    switch ($scope.artwork.channel_info){
                        case(1):
                            $scope.artwork.channel_info = '租租艺术';
                            break;
                        case(2):
                            $scope.artwork.channel_info = '设计师平台';
                            break;
                        case(3):
                            $scope.artwork.channel_info = 'wx';
                            break;
                        case(4):
                            $scope.artwork.channel_info = '淘宝';
                            break;
                    }
                    switch ($scope.artwork.types){
                        case(1):
                            $scope.artwork.types = '复制版画';
                            break;
                        case(2):
                            $scope.artwork.types = '签名版';
                            break;
                        case(3):
                            $scope.artwork.types = "签名限量版";
                            break;
                    }
                }else{
                    showModal("alert",resp.data.message,$scope);
                }
            })
        }

        //生成业务数据按钮
        $scope.create=function(){
            if($scope.affirm){
                $scope.save = true;
                var obj={
                    apply_id:$scope.artwork.id,
                    sale_num:$scope.business.number,
                    unit_price:$scope.business.price
                }
                postJson.do("add/business",obj).then(function (resp) {
                    if(resp.data.code === 0){
                        $state.go("tabs.business/list");
                    }else{
                        $scope.save = false;
                        showModal("alert",resp.data.message,$scope);
                    }
                })
            }else{
                var title="请点击确认按钮以确认审批信息";
                showModal("alert",title,$scope);
            }
        }
        // 取消按钮
        $scope.no=function(){
            $('#myModal').modal('hide')
        }
}])