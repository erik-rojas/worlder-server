(function($) {
    $('.action-button').on('click','.saveJob', function(){
        if(!user_id){
            url = rootURL+"login";
            location.replace(url);
        }
        url = rootURL+"jobseeker/jobs/save";
        let formData = {
            user_id: $(this).attr('value').split(',')[1],
            job_id: $(this).attr('value').split(',')[0],
        }
        that = this;
        $.ajax({
            url: url,
            data: formData,
            type: "POST",
            success: function (data) {
                console.log('datatat', data);
                $(that).html('<i class="fa fa-heart"data-toggle="tooltip" data-placement="top" title="Đã lưu" style="color:red"></i>');
                $(that).attr('title','Đã lưu');
                $(that).attr('key',JSON.parse(data).id);
                $(that).addClass('unsaveJob');
                $(that).removeClass('saveJob');
            },
            error: function (err) {
            }
        })
    })

    $('.action-button').on('click','.unsaveJob', function(){
        url = rootURL+"jobseeker/jobs/unsave";
        let formData = {
            user_id: $(this).attr('value').split(',')[1],
            job_id: $(this).attr('value').split(',')[0],
            key: $(this).attr('key')
        }
        that = this;
        $.ajax({
            url: url,
            data: formData,
            type: "POST",
            success: function (data) {
                $(that).html('<i class="fa fa-heart"data-toggle="tooltip" data-placement="top" title="Lưu vào danh sách" style="color:#cdcdcd"></i>');
                $(that).attr('title','Lưu vào danh sách');
                $(that).attr('key',JSON.parse(data).id);
                $(that).addClass('saveJob');
                $(that).removeClass('unsaveJob');
            },
            error: function (err) {
            }
        })
    })

    $('.toLogin').on('click', function(){
        url = rootURL+"login";
        location.replace(url);
    })
        
})(jQuery);

