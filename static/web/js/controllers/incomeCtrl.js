/**
 * Created by liqiang on 17/7/4.
 */
index.controller('incomeCtrl', ['$scope','getMsg','postJson','$http','$window','IPprefix','showModal',
    function($scope,getMsg,postJson,$http,$window,IPprefix,showModal){


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
    getMsg.do('income/list').then(function(resp){
        if(resp.data.code === 0){
            $scope.incomeList=resp.data.data;
        }
    })
    //全选
    $scope.allChecked=function(flag){
        if(flag){
            $scope.incomeList.forEach(function(x){
                $scope.selected.push(x.id);
            })
        }else{
            $scope.selected=[];
        }
    }
    //删除按钮
    $scope.del=function(){
        var selected=$scope.selected.join(",");
        if(!selected){
            var title = "请选择要删除的艺术家收入核算信息";
            showModal("alert",title,$scope);
            return;
        }
        var title="删除艺术家收入核算信息，确认删除?"
        showModal("confirm",title,$scope);
        $scope.yes=function(){
            var incomes={
                income_ids:selected
            };
            postJson.do('income/delete/',incomes).then(function(resp){
                if(resp.data.code === 0){
                    $('#myModal').modal('hide');
                    $scope.incomeList=resp.data.data;
                }else{
                    showModal("alert",resp.data.message,$scope);
                }
            })
        }
    }
    // 打印按钮
    $scope.print=function(){
        var selected=$scope.selected.join(",");
        if(!selected){
            var title = "请选择要打印的艺术家收入核算信息";
            showModal("alert",title,$scope);
            return;
        }
        var title = "打印艺术家收入核算信息会导出Excel表格，确认打印?";
        showModal("confirm",title,$scope);
        $scope.yes=function(){
            var incomes={
                category:"income",
                ids:selected
            };
            postJson.do('export/excel',incomes).then(function(resp){
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
                search:searchText
            }
            $http(
                {method:'GET',url:IPprefix+"income/list",params:info}
            ).then(function(resp){
                if(resp.data.code === 0){
                    $scope.incomeList=resp.data.data;
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