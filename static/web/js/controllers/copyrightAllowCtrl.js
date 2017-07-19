/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-07-04 11:27:27
 * @version $Id$
 */
index.controller('copyrightAllowCtrl', ['$scope','getMsg','postJson','userInfo','$http','IPprefix','showModal', function($scope,getMsg,postJson,userInfo,$http,IPprefix,showModal){
	// 初始化数据
	$scope.selected=[];	// 选择多项
	$scope.mainData=[];
	$scope.user=userInfo.data
	// 列表数据获取
	getMsg.do('list/apply/').then(function(res){
		if(res.data.code==0){
			// console.log(res)
			$scope.mainData=res.data.data
		}else{
            showModal('alert',res.message,$scope)
        }
	})

	//搜索
    $scope.search = function(searchText){
        if(searchText){
            var info={
                search:searchText
            }
            $http(
                {method:'GET',url:IPprefix+"list/apply/",params:info}
            ).then(function(resp){
                if(resp.data.code === 0){
                    $scope.mainData=resp.data.data;
                }else{
                    showModal('alert',res.message,$scope)
                }
            })
        }
    };

	// 同意、拒绝按钮
	$scope.deal=function(n,id){
		if(n==1){
            showModal('confirm','同意当前审批请求吗？',$scope)
            // 确认删除按钮
            $scope.yes=function(){
                postJson.do('action/apply/'+id,{"action_id":n,"uid":userInfo.uid}).then(function(res){
                    // console.log(res)
                    if(res.data.code==0){
                        // 数据更新
                        getMsg.do('list/apply/').then(function(res){
                            if(res.data.code==0){
                                // console.log(res)
                                $scope.mainData=res.data.data
                                $('#myModal').modal('hide')
                            }else{
                                $('#myModal').modal('hide')
                                showModal('alert',res.message,$scope)
                            }
                        })
                    }
                })
            }
        }else if(n==0){
            showModal('confirm','拒绝当前审批请求吗？',$scope)
            // 确认删除按钮
            $scope.yes=function(){
                postJson.do('action/apply/'+id,{"action_id":n,"uid":userInfo.uid}).then(function(res){
                    // console.log(res)
                    if(res.data.code==0){
                        // 数据更新
                        getMsg.do('list/apply/').then(function(res){
                            if(res.data.code==0){
                                // console.log(res)
                                $scope.mainData=res.data.data
                                $('#myModal').modal('hide')
                            }else{
                                $('#myModal').modal('hide')
                                showModal('alert',res.message,$scope)
                            }
                        })
                    }
                })
            }
        }
	}

    // 取消按钮
    $scope.no=function(){
        $('#myModal').modal('hide')
    }

// 暂时没用
	// 复选框绑定
    $scope.isChecked = function(id){  
        return $scope.selected.indexOf(id) >= 0
    }
    // 复选框事件
    $scope.updateSelection = function($event,id){  
        var checkbox = $event.target
        var checked = checkbox.checked
        if(checked){  
            $scope.selected.push(id)
        }else{  
            var idx = $scope.selected.indexOf(id)
            $scope.selected.splice(idx,1)
        }
    }
    // 全选按钮绑定
    $scope.isCheckedAll = function(){  
    	return ($scope.selected.length==$scope.mainData.length)
    }
    // 全选按钮
    $scope.selectAll=function($event){
    	var checkbox = $event.target
        var checked = checkbox.checked
        if(checked){  
        	$scope.selected=[];
            angular.forEach($scope.mainData,function(item,index){
            	$scope.selected.push(item.id)
            }); 
        }else{  
            $scope.selected=[];
        }
    }

    
}])
