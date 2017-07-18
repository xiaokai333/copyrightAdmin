/**
 * Created by liqiang on 17/7/4.
 */
index.controller('artworkRequestCtrl',['$scope','$stateParams','getMsg','postJson','userInfo','showModal','$state','$rootScope',
    function($scope,$stateParams,getMsg,postJson,userInfo,showModal,$state,$rootScope){

        //初始化
        var artworkId = $stateParams['artworkId'];
        //获取选项内容
        var tag = JSON.parse(localStorage.getItem("tag"));
        $scope.print_types=tag.print_types;
        $scope.channel_info=tag.channel_info;
        $scope.request={work_id:artworkId};
        //获取该艺术品信息
        getMsg.do("work/detail/"+artworkId).then(function(resp){
            if(resp.data.code === 0){
                $scope.artwork = resp.data.data;
            }
        })

        //发起审批按钮
        $scope.subReq=function(id){
            $scope.checkd=true;
            if(typeof ($scope.request.channel_info) == "undefined" || typeof ($scope.request.types) == "undefined"){
                var title = "请检查审批信息是否完整";
                showModal("alert",title,$scope)
                $scope.checkd=false;
            }
            if($scope.checkd){
                $scope.request.uid=userInfo.uid;
                postJson.do("add/apply",$scope.request).then(function(resp){
                    if(resp.data.code === 0){
                        $state.go("tabs.artwork/list");
                    }
                })
            }
        }
        // 取消按钮
        $scope.no=function(){
            $('#myModal').modal('hide')
        }
}])