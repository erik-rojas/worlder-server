(function($) {
    var ctl = $("form.formData").attr("controller");
    
    var base64_img;
    $('.iwj-'+ctl+'-form2 #image').change(function(){
        var file = this.files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
            base64_img=reader.result;
        }
        reader.readAsDataURL(file);
    });
    var base64_logo;
    $('.iwj-'+ctl+'-form2 #logo').change(function(){
        var file = this.files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
            base64_logo=reader.result;
        }
        reader.readAsDataURL(file);
    });

    $('.iwj-'+ctl+'-form2').submit(function(e){
        e.preventDefault();
        var formData = $(this).serialize();

        firstname       = $(this).find('input[name="user[firstname]"]').val();
        lastname        = $(this).find('input[name="user[lastname]"]').val();
        email           = $(this).find('input[name="user[email]"]').val();
        password        = $(this).find('input[name="user[password]"]').val();
        name            = $(this).find('input[name="user[name]"]').val();
        image           = $(this).find('input[name="user[image]"]').val();
        number_of_employees = $(this).find('select[name="user[number_of_employees]"]').val();
        description     = $(this).find('textarea[name="user[description]"]').val();
        address         = $(this).find('input[name="user[address]"]').val();
        province        = $(this).find('select[name="user[province]"]').val();
        country         = $(this).find('select[name="user[country]"]').val();
        // representative  = $(this).find('input[name="user[representative]"]').val();
        phone           = $(this).find('input[name="user[phone]"]').val();
        role           = $(this).find('input[name="role"]').val();

        formData = {
            user: {
                firstname,
                lastname,
                email,
                password,
                name,
                image: base64_img,
                logo: base64_logo,
                number_of_employees,
                description,
                address,
                province,
                country,
                // representative,
                phone
            },
            role
        }

        Object.keys(formData.user).map(item=>{
            $('.err-'+ctl+'-'+item).html("");
        })
        url = rootUrl+ctl+"/create";
        $.ajax({
            url: url,
            data: formData,
            type: "POST",
            success: function (data) {
                location.replace(rootUrl+'login');
            },
            error: function (err) {
                data = JSON.parse(err.responseText);
                Object.keys(data.errors).map(item=>{
                    $('.err-'+ctl+'-'+item).html(data.errors[item]);
                })
                
                
            }
        })
    })
    $('.iwj-candidate-form2').submit(function(e){
        e.preventDefault();

        id              = $(this).find('input[name="user[id]"]').val();
        firstname       = $(this).find('input[name="user[firstname]"]').val();
        lastname        = $(this).find('input[name="user[lastname]"]').val();
        date_of_birth   = $(this).find('input[name="jobseeker[date_of_birth]"]').val();
        phone           = $(this).find('input[name="user[phone]"]').val();
        email           = $(this).find('input[name="user[email]"]').val();
        province        = $(this).find('select[name="jobseeker[province]"]').val();
        district        = $(this).find('input[name="jobseeker[district]"]').val();
        married         = $(this).find('select[name="jobseeker[married]"]').val();
        address         = $(this).find('input[name="user[address]"]').val();
        gender          = $(this).find('select[name="jobseeker[gender]"]').val();
        job_purpose     = $(this).find('textarea[name="jobseeker[job_purpose]"]').val();
        work_title      = $(this).find('input[name="jobseeker[work_title]"]').val();
        desire_level    = $(this).find('select[name="jobseeker[desire_level]"]').val();
        current_position= $(this).find('select[name="jobseeker[current_position]"]').val();

        salary          = $(this).find('input[name="jobseeker[salary]"]').val();
        id_type_of_work = $(this).find('select[name="jobseeker[id_type_of_work]"]').val();
        category_id     = $(this).find('select[name="jobseeker[category_id]"]').val();
        work_address    = $(this).find('input[name="jobseeker[work_address]"]').val();
        experience      = $(this).find('input[name="jobseeker[experience]"]').val();
        max_degree      = $(this).find('select[name="jobseeker[max_degree]"]').val();
        language        = $(this).find('input[name="jobseeker[language]"]').val();
        education_info  = $(this).find('textarea[name="jobseeker[education_info]"]').val();
        skill           = $(this).find('input[name="jobseeker[skill]"]').val();
        achievements    = $(this).find('input[name="jobseeker[achievements]"]').val();

        formData = {
            user: {
                firstname      ,
                lastname       ,
                phone          ,
                email          ,
                address        ,
                id
            },
            jobseeker: {
                date_of_birth  ,
                province       ,
                district       ,
                married        ,
                gender         ,
                job_purpose    ,
                work_title     ,
                desire_level   ,
                current_position,
                salary         ,
                id_type_of_work,
                category_id    ,
                work_address   ,
                experience     ,
                max_degree     ,
                language       ,
                education_info ,
                skill          ,
                achievements   
            }
        }
        url = rootUrl+"jobseeker/dashboard/updateProfile";
        Object.keys(formData.user).map(item=>{
            $('.err-updateprofile'+'-'+item).html("");
        })
        Object.keys(formData.jobseeker).map(item=>{
            $('.err-updateprofile'+'-'+item).html("");
        })
        $.ajax({
            url: url,
            data: formData,
            type: "POST",
            success: function (data) {
                location.replace(rootUrl+'jobseeker/dashboard');
            },
            error: function (err) {
                data = JSON.parse(err.responseText);
                Object.keys(data.errors).map(item=>{
                    $('.err-updateprofile'+'-'+item).html(data.errors[item]);
                })
            }
        })
    })

    $('.iwj-change-password-form2').submit(function(e){
        e.preventDefault();
        url = rootUrl+"jobseeker/dashboard/updatePassword";
        current_password       = $(this).find('input[name="current_password"]').val();
        new_password           = $(this).find('input[name="new_password"]').val();
        id                     = $(this).find('input[name="user[id]"]').val();
        formData = {
            user: {
                current_password,
                new_password,
                id
            }
        }
        $.ajax({
            url: url,
            data: formData,
            type: "POST",
            success: function (data) {
                alert("Đổi mật khẩu thành công")
                location.replace(rootUrl+'jobseeker/dashboard');
            },
            error: function (err) {
                $('.err-password').html(JSON.parse(err.responseText).errors)
            }
        })
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $('button.work_experience-form').on('click', function(e){
        e.preventDefault();
        url = rootUrl+"jobseeker/dashboard/addWorkExperience";
        position        = $('input[name="work_experience[position]"]').val();
        company         = $('input[name="work_experience[company]"]').val();
        work_from       = $('input[name="work_experience[work_from]"]').val();
        work_to         = $('input[name="work_experience[work_to]"]').val();
        work_description= $('textarea[name="work_experience[work_description]"]').val();
        user_id              = $('input[name="user[id]"]').val();

        formData = {
            work_experience: {
                position,
                company,
                work_from,
                work_to,
                work_description,
                user_id
            }
        }
        Object.keys(formData.work_experience).map(item=>{
            $('.err-work_experience'+'-'+item).html("");
        })
        $.ajax({
            url: url,
            data: formData,
            type: "POST",
            success: function (data) {
                $('div.work_experience-form').css('display','none');
                item = JSON.parse(data).data;

                html = `<div class="col-md-12 item-deleteWorkExperience-${item.id}">
                        <div class='profile-card clearfix'>
                            <div class='content '>
                                <div class="row">
                                    <label class="col-xs-4 col-sm-3">Vị trí / Chức danh <span class="col_ff0000bold">*</span></label>
                                    <div class="col-xs-8 col-sm-9">
                                        <span>${item.position}</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <label class="col-xs-4 col-sm-3">Công ty <span class="col_ff0000bold">*</span></label>
                                    <div class="col-xs-8 col-sm-9">
                                        <span>${item.company}</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <label class="col-xs-4 col-sm-3">Thời gian làm việc <span class="col_ff0000bold">*</span></label>
                                    <div class="col-xs-8 col-sm-9 form-inline iwjmb-field">
                                        <span>${item.work_from}-->${item.work_to}</span>

                                    </div>
                                </div>
                                <div class="row">
                                    <label class="col-xs-12 col-sm-3">Mô tả công việc <span class="col_ff0000bold">*</span></label>
                                    <div class="col-xs-12 col-sm-9">
                                        <span>${item.work_description}</span>

                                    </div>
                                </div>
                            </div>
                            <div class='action text-right'>
                                <button type="button" class="iwj-btn iwj-btn-iwj-btn-danger btn-delete-item" act="deleteWorkExperience" value="${item.id}" userid="${item.user_id}">X</button>
                            </div>
                        </div>
                    </div>`;
                $('.list-work_experience').prepend(html);
            },
            error: function (err) {
                data = JSON.parse(err.responseText);
                Object.keys(data.errors).map(item=>{
                    $('.err-work_experience'+'-'+item).html(data.errors[item]);
                })            
            }
        })

    });
    $('button.education-form').on('click', function(e){
        e.preventDefault();
        url = rootUrl+"jobseeker/dashboard/addEducation";
        school_name         = $('input[name="education[school_name]"]').val();
        degree              = $('select[name="education[degree]"]').val();
        graduated_date      = $('input[name="education[graduated_date]"]').val();
        description         = $('textarea[name="education[description]"]').val();
        user_id                  = $('input[name="user[id]"]').val();

        formData = {
            education: {
                school_name,
                degree,
                graduated_date,
                description,
                user_id
            }
        }
        Object.keys(formData.education).map(item=>{
            $('.err-education'+'-'+item).html("");
        })
        $.ajax({
            url: url,
            data: formData,
            type: "POST",
            success: function (data) {
                $('form.education-form').css('display','none');
                item = JSON.parse(data).data;

                html = `<div class="col-md-12 item-deleteEducation-${item.id}">
                            <div class='profile-card clearfix'>
                                <div class='content '>
                                    <div class="row">
                                        <label class="col-xs-4 col-sm-3">Trường <span class="col_ff0000bold">*</span></label>
                                        <div class="col-xs-8 col-sm-9">
                                            <span>${item.school_name}</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <label class="col-xs-4 col-sm-3">Bằng cấp <span class="col_ff0000bold">*</span></label>
                                        <div class="col-xs-8 col-sm-9">
                                            <span>${item.degree_name}</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <label class="col-xs-4 col-sm-3">Thời gian tốt nghiệp <span class="col_ff0000bold">*</span></label>
                                        <div class="col-xs-8 col-sm-9 form-inline iwjmb-field">
                                            <span>${item.graduated_date}</span>

                                        </div>
                                    </div>
                                    <div class="row">
                                        <label class="col-xs-12 col-sm-3">Mô tả<span class="col_ff0000bold">*</span></label>
                                        <div class="col-xs-12 col-sm-9">
                                            <span>${item.description}</span>

                                        </div>
                                    </div>
                                </div>
                                <div class='action text-right'>
                                    <button type="button" class="iwj-btn iwj-btn-iwj-btn-danger btn-delete-item" act="deleteEducation" value="${item.id}" userid="${item.user_id}">X</button>
                                </div>
                            </div>
                        </div>`;
                    console.log('datt html', html);
                $('.list-education').prepend(html);
            },
            error: function (err) {
                data = JSON.parse(err.responseText);
                Object.keys(data.errors).map(item=>{
                    $('.err-education'+'-'+item).html(data.errors[item]);
                })            }
        })

    });
    $('button.professional_skill-form').on('click', function(e){
        e.preventDefault();

        url = rootUrl+"jobseeker/dashboard/addProfessionalSkill";
        name       = $('input[name="professional_skill[name]"]').val();
        description= $('textarea[name="professional_skill[description]"]').val();
        level      = $('input[name="professional_skill[level]"]').val();
        user_id         = $('input[name="user[id]"]').val();

        formData = {
            professional_skill: {
                name,
                description,
                level,
                user_id
            }
        }
        Object.keys(formData.professional_skill).map(item=>{
            $('.err-professional_skill'+'-'+item).html("");
        })
        $.ajax({
            url: url,
            data: formData,
            type: "POST",
            success: function (data) {
                $('form.professional_skill-form').css('display','none');
                item = JSON.parse(data).data;

                html = `<div class="col-md-12 item-deleteProfessionalSkill-${item.id}">
                            <div class='profile-card clearfix'>
                                <div class='content '>
                                    <div class="row">
                                        <label class="col-xs-4 col-sm-3">Kĩ năng <span class="col_ff0000bold">*</span></label>
                                        <div class="col-xs-8 col-sm-9">
                                            <span>${item.name}</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <label class="col-xs-4 col-sm-3">Mô tả <span class="col_ff0000bold">*</span></label>
                                        <div class="col-xs-8 col-sm-9">
                                            <span>${item.description}</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <label class="col-xs-4 col-sm-3">Mức độ <span class="col_ff0000bold">*</span></label>
                                        <div class="col-xs-8 col-sm-9 form-inline iwjmb-field">
                                            <span>${item.level}</span>

                                        </div>
                                    </div>
                                </div>
                                <div class='action text-right'>
                                    <button type="button" class="iwj-btn iwj-btn-iwj-btn-danger btn-delete-item" act="deleteProfessionalSkill" value="${item.id}" userid="${item.user_id}">X</button>
                                </div>
                            </div>
                        </div>`;
                $('.list-professional_skill').prepend(html);
            },
            error: function (err) {
                data = JSON.parse(err.responseText);
                Object.keys(data.errors).map(item=>{
                    $('.err-professional_skill'+'-'+item).html(data.errors[item]);
                })            
            }
        })
    });
    $('button.language-form').on('click', function(e){
        e.preventDefault();

        url = rootUrl+"jobseeker/dashboard/addLanguage";
        language       = $('select[name="language[language]"]').val();
        level          = $('select[name="language[level]"]').val();
        user_id             = $('input[name="user[id]"]').val();

        formData = {
            language: {
                language,
                level,
                user_id
            }
        }
        Object.keys(formData.language).map(item=>{
            $('.err-language'+'-'+item).html("");
        })
        $.ajax({
            url: url,
            data: formData,
            type: "POST",
            success: function (data) {
                $('form.language-form').css('display','none');
                item = JSON.parse(data).data;

                html = `<div class="col-md-12 item-deleteLanguage-${item.id}">
                            <div class='profile-card clearfix'>
                                <div class='content '>
                                    <div class="row">
                                        <label class="col-xs-4 col-sm-3">Ngôn ngữ <span class="col_ff0000bold">*</span></label>
                                        <div class="col-xs-8 col-sm-9">
                                            <span>${item.language_name}</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <label class="col-xs-4 col-sm-3">Trình độ <span class="col_ff0000bold">*</span></label>
                                        <div class="col-xs-8 col-sm-9">
                                            <span>${item.level_name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class='action text-right'>
                                    <button type="button" class="iwj-btn iwj-btn-iwj-btn-danger btn-delete-item" act="deleteLanguage" value="${item.id}" userid="${item.user_id}">X</button>
                                </div>
                            </div>
                        </div>`;
                $('.list-language').prepend(html);

            },
            error: function (err) {
                data = JSON.parse(err.responseText);
                Object.keys(data.errors).map(item=>{
                    $('.err-language'+'-'+item).html(data.errors[item]);
                })            
            }
        })
    });


    $('.btn-add-work_experience').on('click', function(){
        $('div.work_experience-form').css('display','block');
    });
    $('.btn-add-education').on('click', function(){
        $('form.education-form').css('display','block');
    })
    $('.btn-add-professional_skill').on('click', function(){
        $('form.professional_skill-form').css('display','block');
    })
    $('.btn-add-language').on('click', function(){
        $('form.language-form').css('display','block');
    })

    $('.btn-cancel-work_experience').on('click', function(){
        $('div.work_experience-form').css('display','none');
    });
    $('.btn-cancel-education').on('click', function(){
        $('form.education-form').css('display','none');
    })
    $('.btn-cancel-professional_skill').on('click', function(){
        $('form.professional_skill-form').css('display','none');
    })
    $('.btn-cancel-language').on('click', function(){
        $('form.language-form').css('display','none');
    })

    $('.list-list-data').on('click', '.btn-delete-item', function(){
        var isDel = confirm("Bạn chắc chắn muốn xóa?");
        var act = $(this).attr('act');
        var id = $(this).attr('value');
        if(isDel){
            url = rootUrl+"jobseeker/dashboard/"+act;
            formData = {
                data: {
                    id: id,
                    user_id: $(this).attr('userid')
                }
            }
            $.ajax({
                url: url,
                data: formData,
                type: "POST",
                success: function (data) {
                    $('.item-'+act+'-'+id).remove();
                },
                error: function (err) {
                    alert("Đã xảy ra lỗi")            
                }
            })
        }
    })

    var avatar;
    $('#avatar').change(function(){
        var file = this.files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
            avatar=reader.result;
        }
        reader.readAsDataURL(file);
    });

    $('.btn-upload-avatar').on('click', function(){
        user_id         = $('input[name="user[id]"]').val();
        formData = {
            user: {
                avata: avatar,
            },
            id: user_id
        }
        url = rootUrl+"jobseeker/dashboard/updateAvatar";
        $.ajax({
            url: url,
            data: formData,
            type: "POST",
            success: function (data) {
                $('.avatar-view-v2 img').attr('src',JSON.parse(data).data);
            },
            error: function (err) {
            }
        })
    })
})(jQuery);

