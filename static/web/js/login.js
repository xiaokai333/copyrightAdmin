/**
 * Created by liqiang on 17/7/4.
 */
$(function(){

    if(sessionStorage.getItem("userInfo")){
        window.location.href="index.html#!/tabs/artistsFiles/list";
    }
    $("#login").click(function(){

        var username=$("#username").val();
        var password=$("#password").val();

        if(username != "" && password != ""){
            var user={
                username:username,
                password:password
            };
            $.post("http://172.16.7.235:8000/login/",user,function(resp){
                if(resp.code === 0){
                    $(".msg").html(resp.message);
                    var obj = {
                        login:"ok",
                        username:resp.username,
                        data:resp.data,
                        uid:resp.uid
                    }
                    sessionStorage.setItem("userInfo",JSON.stringify(obj));
                    window.location.href="index.html#!/tabs/artistsFiles/list";
                }else{
                    $(".msg").html(resp.message);
                }
            })
        }else{
            $(".msg").html("请填写用户名和密码!");
        }

    })
})