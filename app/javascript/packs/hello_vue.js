var $ = require('jquery');

//TodoListを取得し表示する
$.get('api/todo', $.noop, 'json').done(function (data, statusText, jqXHR) {
    var todo = data;
    $.each(todo, function () {
        var tr = $('<tr>').appendTo('.todo-list');
        $('<td>', {text: String(this.id)}).appendTo(tr).addClass('todoId');
        $('<td>', {text: String(this.title)}).appendTo(tr).addClass('todoTitle');
        if (this.done) {
            var td = $('<td>').appendTo(tr).addClass('todoStatus');
            $('<input type="checkbox" />').attr("checked", true).appendTo(td);
        } else {
            var td = $('<td>').appendTo(tr).addClass('todoStatus');
            $('<input type="checkbox" />').attr("checked", false).appendTo(td);
        }
        var td = $('<td>').appendTo(tr);
        $('<div>', {text: '編集'}).appendTo(td).addClass('editTodo');
        var td = $('<td>').appendTo(tr);
        $('<div>', {text: '削除'}).appendTo(td).addClass('deleteTodo');
    });
});

//投稿した内容をjsonでpostする
$('#post-btn').click(function () {
    //送信が完了するまでボタン機能を無効
    var button = $(this);
    button.attr("disabled", true);
    //フィールドの値からjsonデータを作成
    var data = {
        todo: {
            'title': $('#title').val(),
            'done': false
        }
    };
    $.ajax({
        type: "post",
        url: "/api/todo/",
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
        success: function (json_data) {
            var tr = $('<tr>').appendTo('.todo-list');
            $('<td>', {text: String(json_data.id)}).appendTo(tr).addClass('todoId');
            $('<td>', {text: String(json_data.title)}).appendTo(tr).addClass('todoTitle');
            var td = $('<td>').appendTo(tr).addClass('todoStatus');
            $('<input type="checkbox" />').attr("checked", false).appendTo(td);
            var td = $('<td>').appendTo(tr);
            $('<div>', {text: '編集'}).appendTo(td).addClass('editTodo');
            var td = $('<td>').appendTo(tr);
            $('<div>', {text: '削除'}).appendTo(td).addClass('deleteTodo');
        },
        complete: function () { // 成功・失敗に関わらず通信が終了した際の処理
            button.attr("disabled", false);  // ボタンを再び enableにする
        }
    });
    //フォーム内容をクリア
    $('#title').val("");
});

$("#title").keypress(function (e) {
    if(e.which == 13){
        $("#post-btn").click();
    }
});

//削除ボタンが押されたときにその投稿内容を削除する
$(document).on('click', '.deleteTodo', function () {
    var todoId = $(this).parent().prevAll('.todoId').text();
    $(this).parents('tr').remove();

    $.ajax({
        type: "delete",
        url: "/api/todo/" + todoId,
        contentType: "application/json",
    });

});

//編集ボタンが押されたときに編集フォームを表示する
$(document).on('click', '.editTodo', function () {
    var todo = $(this).parent().prevAll('.todoTitle');
    var todoData = todo.text();
    var todoId = $(this).parent().prevAll('.todoId').text();
    $('#repost-title').val(todoData);
    $('.edit-modal-wrapper').fadeIn();

    //編集フォームの修正ボタンが押されたときに投稿内容を更新する
    $(document).on('click', '#repost-btn', function () {
        //フィールドの値からjsonデータを作成
        var todoData = $('#repost-title').val();
        var data = {
            todo: {
                'title': todoData,
                'done': false
            }
        };

        $.ajax({
            type: "patch",
            url: "/api/todo/" + todoId,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function () {
                todo.text(todoData);
                $('.edit-modal-wrapper').fadeOut();
            },
            complete: function () { // 成功・失敗に関わらず通信が終了した際の処理
            }
        });
    });

    $("#repost-title").keypress(function (e) {
        if(e.which == 13){
            $("#repost-btn").click();
        }
    });

});

//編集フォームの閉じるを押されたときに編集フォームを閉じる
$(document).on('click', '.close-modal', function () {
    $('.edit-modal-wrapper').fadeOut();
});
