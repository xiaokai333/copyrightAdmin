/**
 * Created by liqiang on 17/7/4.
 */
index.controller('artworkAccreditCtrl',['$scope','$location','$stateParams','getMsg','postJson','$window','$state','showModal',
    function($scope,$location,$stateParams,getMsg,postJson,$window,$state,showModal){

        var artworkId = $stateParams['artworkId'];
        $scope.open = false;
        $scope.addSub = function(){
            var subject='';
            $scope.subject.push(subject);
        };
        $scope.delSub = function(x){
            if(x<1){
                return;
            }else{
                $scope.subject.splice(x,1);
            }
        };
        //载入该艺术家授权信息按钮
        $scope.isload=false;
        $scope.hasAuthorize=true;
        $scope.loadArtist=function(id){
            getMsg.do("work/artist/authorize/"+id).then(function(resp){
                if(resp.data.code === 0){
                    $scope.isload=true;
                    $scope.hasAuthorize = true;
                    $scope.authorize = resp.data.data;
                    // 计算对账和核算日期
                    // 授权时间
                    var accountTime=new Date($scope.authorize.authorize_time.split(' ')[0])
                    // 有效时间
                    let useyear=accountTime.getFullYear()+$scope.authorize.authorize_period;
                    let usemonth=accountTime.getMonth()
                    let usedate=accountTime.getDate()
                    var usefulTime=new Date(useyear,usemonth,usedate)
                    // 当前时间
                    var nowDate = new Date()
                    // 对账时间
                    var monthDate = new Date(nowDate.getFullYear(),nowDate.getMonth()+1,1,-1)
                    // 核算时间
                    var yearDate=accountTime
                    while(yearDate<nowDate){
                        yearDate=new Date(yearDate.getFullYear(),yearDate.getMonth()+7,1,-1)
                    }
                    if(nowDate<usefulTime){
                        $scope.monthDate = monthDate.getFullYear()+'年'+(monthDate.getMonth()+1)+'月'+monthDate.getDate()+'日';
                        $scope.yearDate = yearDate.getFullYear()+'年'+(yearDate.getMonth()+1)+'月'+yearDate.getDate()+'日';
                    }else{
                        $scope.monthDate = '已逾期'
                        $scope.yearDate = '已逾期'
                    }
                    $scope.open = true;
                }else{
                    $scope.hasAuthorize = false;
                    var title=resp.data.message+",请去艺术家档案填充";
                    showModal("alert",title,$scope);
                }
            })
        }

        //跳过按钮
        $scope.skip=function(){
            $location.path('/tabs/artwork/list');
        }

        //获取该艺术品授权信息
            getMsg.do("work/detail/" + artworkId).then(function (resp) {
                if (resp.data.code === 0) {
                    $scope.artwork = resp.data.data;
                    if($scope.artwork.authorize_body){
                        $scope.subject = $scope.artwork.authorize_body.split(',');
                        $scope.loadArtist($scope.artwork.artist);
                    }else{
                        $scope.open = false;
                        $scope.subject = [$scope.artwork.artist_name];
                    }
                }
            })
            //确认创建授权信息
            $scope.creat=function(){
                if(!$scope.isload){
                    var title="请先载入艺术家授权信息";
                    showModal("alert",title,$scope);
                }else if(!$scope.hasAuthorize){
                    var title="该艺术家授权信息不完整,请去艺术家档案填充";
                    showModal("alert",title,$scope);
                }else{
                    var obj={
                        authorize_body:$scope.subject.toString()
                    }
                    postJson.do("work/authorize/"+artworkId,obj).then(function(resp){
                        if(resp.data.code===0){
                            $state.go("tabs.artwork/list");
                        }else{
                            showModal("alert",resp.data.message,$scope);
                        }
                    })
                }
            }

        // 取消按钮
        $scope.no=function(){
            $('#myModal').modal('hide')
        }

}])