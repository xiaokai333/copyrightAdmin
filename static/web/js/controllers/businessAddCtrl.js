/**
 * Created by liqiang on 17/7/4.
 */
index.controller('businessAddCtrl', ['$scope','getMsg','postJson','$http','IPprefix','$state','showModal',
    function($scope,getMsg,postJson,$http,IPprefix,$state,showModal){

        //初始化
        $scope.save = false;
        $scope.business={};
        $scope.affirm=false;
        var tag = JSON.parse(localStorage.getItem("tag"));
        //查找编号对应信息
        $scope.find=function(id){
            $http(
                {method:'GET',url:IPprefix+"business/search/apply",params:{apply_number:id}}
            ).then(function (resp) {
                if(resp.data.code === 0){
                    $scope.affirm=true;
                    $scope.artwork=resp.data;
                    $scope.artwork.channel_info = tag.channel_info[$scope.artwork.channel_info-1].text;
                    $scope.artwork.types = tag.print_types[$scope.artwork.types-1].text;
                }else{
                    showModal("alert",resp.data.message,$scope);
                }
            })
        }

        $scope.updataOk=function(){
            $scope.affirm=false;
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