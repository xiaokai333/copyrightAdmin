
index.controller('tabCtrl',['$scope','userInfo',
    function($scope,userInfo){
        $scope.userInfo=userInfo;
        //安全退出
        $scope.quit=function(){
            if(confirm("确认退出版权管理平台?")){
                sessionStorage.clear();
                window.location.href="login.html";
            }else{
                return;
            }
        }
    }
])