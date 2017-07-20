/**
 * Created by liqiang on 17/7/4.
 */
index.controller('businessListCtrl', ['$scope','getMsg','$http','IPprefix','postJson','$window','userInfo','showModal',
    function($scope,getMsg,$http,IPprefix,postJson,$window,userInfo,showModal){

        //初始化
        $scope.userInfo = userInfo;
        //复选框选择获取id
        $scope.selected = [];
        var updateSelected = function(action,id){
            if(action == 'add' && $scope.selected.indexOf(id) == -1){
                $scope.selected.push(id);
            }
            if(action == 'remove' && $scope.selected.indexOf(id)!=-1){
                var idx = $scope.selected.indexOf(id);
                $scope.selected.splice(idx,1);
            }
        }
        $scope.updateSelection = function($event, id){
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            updateSelected(action,id);
        }
        $scope.isSelected = function(id){
            return $scope.selected.indexOf(id)>=0;
        }

        // 列表数据获取
        getMsg.do('list/business').then(function(resp){
            if(resp.data.code === 0){
                $scope.businessList=resp.data.data;
            }else{
                showModal("alert",resp.data.message,$scope);
            }
        })
        //全选
        $scope.allChecked=function(flag){
            if(flag){
                $scope.businessList.forEach(function(x){
                    $scope.selected.push(x.id);
                })
            }else{
                $scope.selected=[];
            }
        }
        // 打印按钮
        $scope.print=function(){
            var selected=$scope.selected.join(",");
            if(!selected){
                var title="请选择要打印的业务数据";
                showModal("alert",title,$scope);
                return;
            }

            var tit="打印业务数据会导出Excel表格，确认打印?";
            showModal("confirm",tit,$scope);
            $scope.yes=function(){
                var business={
                    category:'business',
                    ids:selected
                };
                postJson.do('export/excel',business).then(function(resp){
                    console.log(resp)
                    if(resp.data.code === 0){
                        $('#myModal').modal('hide');
                        $window.open(resp.data.path);
                    }else{
                        showModal("alert",resp.data.message,$scope);
                    }
                })
            }
        }
        //搜索
        $scope.search = function(searchText){
            if(searchText){
                var info={
                    artist:searchText
                }
                $http(
                    {method:'GET',url:IPprefix+"list/business",params:info}
                ).then(function(resp){
                    if(resp.data.code === 0){
                        $scope.businessList=resp.data.data;
                    }else{
                        showModal("alert",resp.data.message,$scope);
                    }
                })
            }
        };
        // 取消按钮
        $scope.no=function(){
            $('#myModal').modal('hide')
        }

}])