var list_cv = [];
var selected_cv = null;
var sheet = null;
var cropObj = null;

jQuery(document).ready(function() {
    getListCV();

    var picker = new CP(document.getElementById('cv-color'));
    picker.on("change", function(color) {
        jQuery('#cv-color').css('background-color', '#' + color);
        jQuery('.cv-template-container .mainDetails').css('background-color', '#' + color);
        jQuery('.cv-template-container .sectionTitle').css('color', '#' + color);
        if (selected_cv) selected_cv.color = color;
    });

    jQuery('#cv-font').change(function() {
        var val = jQuery(this).val();
        jQuery('.cv-template-container').css('font-family', val);
        selected_cv.font_family = val;
    });

    jQuery('#cv-font-size').change(function() {
        var fontSize = jQuery(this).val();
        jQuery('.cv-template-container').css('font-size', fontSize + 'px');
        selected_cv.font_size = fontSize;
    });

    jQuery('#cv_language').change(function() {
        var lang = jQuery(this).val();
        renderExampleCV(); 
    });

    jQuery('.steps a').click(function(e) {
        e.preventDefault();
        var step = jQuery(this).attr('step');
        if (step == 1) {
            jQuery('.creating-cv-step .first').addClass('current');
            jQuery('.creating-cv-step .second').removeClass('current');
            jQuery('.creating-cv-step .last').removeClass('current');
            jQuery('.list-cv-step').removeClass('hidden');
            jQuery('.design-cv-step').addClass('hidden');
            jQuery('.info-cv-step').addClass('hidden');
        } else if (step == 2) {
            if (selected_cv) {
                jQuery('.creating-cv-step .first').removeClass('current');
                jQuery('.creating-cv-step .second').addClass('current');
                jQuery('.creating-cv-step .last').removeClass('current');
                jQuery('.list-cv-step').addClass('hidden');
                jQuery('.design-cv-step').removeClass('hidden');
                jQuery('.info-cv-step').addClass('hidden');
            }
        } else {
            if (selected_cv) {
                jQuery('.creating-cv-step .first').removeClass('current');
                jQuery('.creating-cv-step .second').removeClass('current');
                jQuery('.creating-cv-step .last').addClass('current');
                jQuery('.list-cv-step').addClass('hidden');
                jQuery('.design-cv-step').addClass('hidden');
                jQuery('.info-cv-step').removeClass('hidden');
            }
        }
    });

    CKEDITOR.replace('career-goals', {
        toolbar: [{
            name: 'basicstyles',
            groups: ['basicstyles', 'cleanup'],
            items: ['Bold', 'Italic', 'Underline']
        }, {
            name: 'paragraph',
            groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
            items: ['NumberedList', 'BulletedList']
        }]
    });

    CKEDITOR.replace('outstanding-achievement', {
        toolbar: [{
            name: 'basicstyles',
            groups: ['basicstyles', 'cleanup'],
            items: ['Bold', 'Italic', 'Underline']
        }, {
            name: 'paragraph',
            groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
            items: ['NumberedList', 'BulletedList']
        }]
    });

    jQuery('#add-more-experience').click(function() {
        jQuery('.cloneable-experience').first().clone().addClass('clone').append('<span class="removable">x</span>').prepend('<hr>').appendTo('.experience-input-area');
    });

    jQuery('#add-more-education').click(function() {
        jQuery('.cloneable-education').first().clone().addClass('clone').append('<span class="removable">x</span>').prepend('<hr>').appendTo('.education-input-area');
    });

    jQuery('#add-more-skill').click(function() {
        jQuery('.cloneable-skill').first().clone().addClass('clone').append('<span class="removable">x</span>').appendTo('.skill-input-area');
    });

    var modal = document.getElementById('crop-avatar-modal');
    jQuery('#image-avatar').change(function() {
        jQuery('.popup-cover-preview-image').empty();
        jQuery('.popup-cover-preview-image').append('<img src="" id="preview-avatar">');
        modal.style.display = "block";
        jQuery('body').addClass('overflow-hidden');
        readURL(this);
    });

    jQuery('.crop-image-btn').click(function() {
        cropObj.croppie('result', {
            type: 'base64',
        }).then(function(result) {

            modal.style.display = "none";
            jQuery('body').removeClass('overflow-hidden');
            jQuery('#preview-avatar-cropped').attr('src', result);
        });
    });

    jQuery('.close-modal-btn').click(function() {
        modal.style.display = "none";
        modalPreview.style.display = "none";
        jQuery('body').removeClass('overflow-hidden');
    });

    jQuery(window).scroll(function() {
        var height = $(window).scrollTop();
        if (height > 440) {
            jQuery('#cv-job-control-area').addClass('job-control-area-fixed');
        } else {
            jQuery('#cv-job-control-area').removeClass('job-control-area-fixed');
        }
    });

    jQuery('.multiple-select').fastselect({
        placeholder: 'Chọn ngành nghề'
    });

    var modalPreview = document.getElementById('preview-cv-modal');
    jQuery('#preview-cv-export').click(function() {
        var postData = collectData();
        
        $.ajax({
            method: 'POST',
            url: rootURL + 'cv/getRenderTemplate',
            data: postData,
            dataType: 'json',
        }).done(function (result) {
            jQuery('#preview-cv-modal .container-preview').empty();
            jQuery('#preview-cv-modal .container-preview').append(result.html);
            modalPreview.style.display = "block";
            jQuery('body').addClass('overflow-hidden');
        }).fail(function (err) {

        }).always(function () {
            
        });
        // readURL(this);
    });

    jQuery('#save-cv').click(function () {
        var postData = collectData();
        var action = 'save_cv';
        if (edit_cv_id) {
            action = 'edit_cv/' + edit_cv_id;
        }

        $.ajax({
            method: 'POST',
            url: rootURL + 'cv/' + action,
            data: postData,
            dataType: 'json',
        }).done(function (result) {
            if (result.success) {
                location.href = rootURL + 'cv';
            }
        }).fail(function (err) {

        }).always(function () {
            
        });
    });

    jQuery('.backto-step-1').click(function() {
        jQuery('.creating-cv-step .first').addClass('current');
        jQuery('.creating-cv-step .second').removeClass('current');
        jQuery('.creating-cv-step .last').removeClass('current');
        jQuery('.list-cv-step').removeClass('hidden');
        jQuery('.design-cv-step').addClass('hidden');
        jQuery('.info-cv-step').addClass('hidden');
    });

    jQuery('.backto-step-2').click(function() {
        jQuery('.creating-cv-step .first').removeClass('current');
        jQuery('.creating-cv-step .second').addClass('current');
        jQuery('.creating-cv-step .last').removeClass('current');
        jQuery('.list-cv-step').addClass('hidden');
        jQuery('.design-cv-step').removeClass('hidden');
        jQuery('.info-cv-step').addClass('hidden');
    });


    jQuery('.goto-step-3').click(function() {
        jQuery('.creating-cv-step .first').removeClass('current');
        jQuery('.creating-cv-step .second').removeClass('current');
        jQuery('.creating-cv-step .last').addClass('current');
        jQuery('.list-cv-step').addClass('hidden');
        jQuery('.design-cv-step').addClass('hidden');
        jQuery('.info-cv-step').removeClass('hidden');
    });
});

function collectData() {
    var type_of_works_selected = [];
    var cv_work_experiences = [];
    var cv_language_skills = [];
    var cv_education_details = [];
    var cv_job_skills = [];

    jQuery(".type-of-work:checked").each(function() {
        type_of_works_selected.push(jQuery(this).val());
    });

    jQuery('.cloneable-experience').each(function() {
        var temp = {
            rexp_title: jQuery(this).find('[name="rexp_title"]').val(),
            company_name: jQuery(this).find('[name="company_name"]').val(),
            time_work_from: jQuery(this).find('.year-work-from').val() + '-' + jQuery(this).find('.month-work-from').val() + '-01',
            time_work_to: jQuery(this).find('.year-work-to').val() + '-' + jQuery(this).find('.month-work-to').val() + '-01',
            job_description: jQuery(this).find('[name="job_description"]').val()
        };
        cv_work_experiences.push(temp);
    });

    jQuery('.foreign-language').each(function() {
        var temp = {
            language: jQuery(this).find('[name="foreign_language"]').val(),
            level: jQuery(this).find('[name="level"]').val(),
        };
        cv_language_skills.push(temp);
    });

    jQuery('.cloneable-education').each(function() {
        var temp = {
            school_name: jQuery(this).find('[name="school_name"]').val(),
            degree: jQuery(this).find('[name="degree"]').val(),
            graduation_date: jQuery(this).find('.year-graduate').val() + '-' + jQuery(this).find('.month-graduate').val() + '-01',
            description: jQuery(this).find('[name="description"]').val(),
        };
        cv_education_details.push(temp);
    });

    jQuery('.cloneable-skill').each(function() {
        var temp = {
            skill: jQuery(this).find('[name="skill"]').val(),
            description: jQuery(this).find('[name="skill_description"]').val(),
            level: jQuery(this).find('[name="level"]').val(),
        };
        cv_job_skills.push(temp);
    });


    var postData = {
        cv_template_id: selected_cv.id,
        color: selected_cv.color || selected_cv.default_color,
        language: selected_cv.language || 'vi',
        font_family: selected_cv.font_family || selected_cv.default_font_family,
        font_size: selected_cv.font_size || selected_cv.default_font_size,
        avatar: jQuery('#preview-avatar-cropped').attr('src'),
        first_name: jQuery('[name="first_name"]').val(),
        last_name: jQuery('[name="last_name"]').val(),
        gender: jQuery('[name="gender"]:checked').val(),
        birthdate: jQuery('[name="birthdate"]').val(),
        phone: jQuery('[name="phone"]').val(),
        email: jQuery('[name="email"]').val(),
        marital_status: jQuery('[name="marital_status"]').val(),
        address: jQuery('[name="address"]').val(),
        career_goals: CKEDITOR.instances['career-goals'].getData(),
        cv_job_infos: {
            profile_title: jQuery('[name="profile_title"]').val(),
            hope_level_job: jQuery('[name="hope_level_job"]').val(),
            currency: jQuery('[name="job_info_currency"]').val(),
            salary_from: jQuery('[name="job_info_salary_from"]').val() || 0,
            salary_to: jQuery('[name="job_info_salary_to"]').val() || 0,
            type_of_works: type_of_works_selected,
            categories: jQuery('#job-info-categories').val(),
            hope_district: jQuery('[name="hope_district"]').val()
        },
        experience_year: jQuery('[name="experience_year"]').val(),
        current_rank: jQuery('[name="current_rank"]').val(),
        cv_work_experiences: cv_work_experiences,
        max_degree: jQuery('[name="max_degree"]').val(),
        cv_language_skills: cv_language_skills,
        cv_education_details: cv_education_details,
        cv_job_skills: cv_job_skills,
        outstanding_achievement: CKEDITOR.instances['outstanding-achievement'].getData(),
    };

    return postData;
}

function getListCV() {
    jQuery.ajax({
        url: rootURL + 'cv/get_cv_templates',
        dataType: 'json'
    }).done(function(result) {
        list_cv = result.data;
        for (var i = 0; i < result.data.length; i++) {
            var html_append =
                `<div class="col-md-3 col-sm-4">
                        <div class="thumbnail" style="max-height: 320px; overflow: hidden;">
                            <a alt="` + result.data[i].id + `" href="#" class="preview-cv-image">
                                <img src="` + uploadURI + 'cv_templates/' +result.data[i].image + `" alt="preview image">
                            </a>
                        </div>
                    </div>`;
            jQuery('.list-cv-step').append(html_append);
        }
        if (selected_cv_id) {
            setTemplate(selected_cv_id);
        }
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            jQuery('#preview-avatar').attr('src', e.target.result);
            cropObj = jQuery('#preview-avatar').croppie({
                viewport: {
                    width: 200,
                    height: 200,
                    type: 'square'
                }
            });
        }

        reader.readAsDataURL(input.files[0]);
    }
}

jQuery('.list-cv-step').on('click', '.preview-cv-image', function(e) {
    e.preventDefault();
    var id = jQuery(this).attr('alt');
    setTemplate(id);
});

function setTemplate(id) {
    var cv = list_cv.find(function(ele) {
        return ele.id == id;
    });
    selected_cv = JSON.parse(JSON.stringify(cv));


    selected_cv.font_family = '';
    selected_cv.font_size = '';

    selected_cv.html = selected_cv.html.replace('{{avatar}}', rootURL + 'media/img/avatar.jpg');
    selected_cv.html = selected_cv.html.replace('{{last_name}}', 'Nguyen Van');
    selected_cv.html = selected_cv.html.replace('{{first_name}}', 'A');
    selected_cv.html = selected_cv.html.replace('{{email}}', 'nguyenvana@gmail.com');

    if (selected_cv.language == 'en') {
        selected_cv.html = selected_cv.html.replace('{{profile_title}}', 'Expected Title');
    } else {
        selected_cv.html = selected_cv.html.replace('{{title_personal_infomation}}', 'Thông tin cá nhân');
        selected_cv.html = selected_cv.html.replace('{{title_gender}}', 'Giới tính');
        selected_cv.html = selected_cv.html.replace('{{gender}}', 'Nam');
        selected_cv.html = selected_cv.html.replace('{{title_birthdate}}', 'Ngày sinh');
        selected_cv.html = selected_cv.html.replace('{{birthdate}}', '10-10-2000');
        selected_cv.html = selected_cv.html.replace('{{title_marital_status}}', 'Tình trạng hôn nhân');
        selected_cv.html = selected_cv.html.replace('{{marital_status}}', 'Độc thân');
        selected_cv.html = selected_cv.html.replace('{{title_address}}', 'Địa chỉ');
        selected_cv.html = selected_cv.html.replace('{{address}}', 'địa chỉ nhà ở');
        selected_cv.html = selected_cv.html.replace('{{profile_title}}', 'Vị trí mong muốn ứng tuyển');
        selected_cv.html = selected_cv.html.replace('{{title_phone}}', 'Số ĐT');
        selected_cv.html = selected_cv.html.replace('{{phone}}', '09xxxxxxxx');
        selected_cv.html = selected_cv.html.replace('{{title_objectives}}', 'Mục tiêu nghề nghiệp');
        selected_cv.html = selected_cv.html.replace('{{career_goals}}', 'Mục tiêu nghề nghiệp là một phần quan trọng nhất trong CV. Hãy đề cập những điểm nổi bật của sự nghiệp và mục tiêu cho công việc đang ứng tuyển. Tóm tắt lý do tại sao Nhà tuyển dụng phải chọn bạn (nên từ 80 – 100 từ)');

        selected_cv.html = selected_cv.html.replace('{{title_job_infomation}}', 'Thông tin nghề nghiệp');
        selected_cv.html = selected_cv.html.replace('{{title_hope_level_job}}', 'Cấp bậc');
        selected_cv.html = selected_cv.html.replace('{{hope_level_job}}', 'Nhân viên');
        selected_cv.html = selected_cv.html.replace('{{title_salary}}', 'Mức lương');
        selected_cv.html = selected_cv.html.replace('{{salary}}', 'Thỏa thuận');
        selected_cv.html = selected_cv.html.replace('{{title_type_of_work}}', 'Hình thức làm việc');
        selected_cv.html = selected_cv.html.replace('{{type_of_works}}', 'Nhân viên chính thức');
        selected_cv.html = selected_cv.html.replace('{{title_career}}', 'Ngành nghề');
        selected_cv.html = selected_cv.html.replace('{{career}}', 'Kinh doanh');
        selected_cv.html = selected_cv.html.replace('{{title_hope_district}}', 'Nơi làm việc');
        selected_cv.html = selected_cv.html.replace('{{hope_district}}', 'Hải Châu');

        selected_cv.html = selected_cv.html.replace('{{title_work_experience}}', 'Kinh nghiệm làm việc');
        selected_cv.html = selected_cv.html.replace('{{title_experience_year}}', 'Số năm kinh nghiệm');
        selected_cv.html = selected_cv.html.replace('{{experience_year}}', '10');
        selected_cv.html = selected_cv.html.replace('{{title_current_rank}}', 'Cấp bậc hiện tại');
        selected_cv.html = selected_cv.html.replace('{{current_rank}}', 'Nhân viên');
        selected_cv.html = selected_cv.html.replace('{{work_experience}}', 
            `<article>
                <h2>Vị trí ở công ty A</h2>
                <p class="subDetails">Từ ngày - tới ngày</p>
                <p>- Những thành tựu chính bạn đã gặt hái trong công việc này.</p>
                <p>- Nên thể hiện bằng con số, tỷ lệ phần trăm tăng trưởng hoặc số liệu tài chính.</p>
                <p>- Các kỹ năng bạn đã đạt được.</p>
            </article>
            <article>
                <h2>Vị trí ở công ty B</h2>
                <p class="subDetails">Từ ngày - tới ngày</p>
                <p>- Những thành tựu chính bạn đã gặt hái trong công việc này.</p>
                <p>- Nên thể hiện bằng con số, tỷ lệ phần trăm tăng trưởng hoặc số liệu tài chính.</p>
                <p>- Các kỹ năng bạn đã đạt được.</p>
            </article>`);
        selected_cv.html = selected_cv.html.replace('{{title_skill}}', 'Kỹ năng');
        selected_cv.html = selected_cv.html.replace('{{skill}}', `
            <li>Giải quyết vấn đề <i>(4/5)</i></li>
            <li>Xử lí tình huống <i>(3/5)</i></li>
        `);
        selected_cv.html = selected_cv.html.replace('{{title_language}}', 'Ngôn ngữ');
        selected_cv.html = selected_cv.html.replace('{{f_language}}', `
            <li>Tiếng Việt (Bản ngữ)</li>
            <li>Tiếng Anh (Trung cấp)</li>
        `);
        selected_cv.html = selected_cv.html.replace('{{title_education}}', 'Học vấn');
        selected_cv.html = selected_cv.html.replace('{{title_max_degree}}', 'Bằng cấp cao nhất');
        selected_cv.html = selected_cv.html.replace('{{max_degree}}', 'Đại học');
        selected_cv.html = selected_cv.html.replace('{{education}}', `
                <article>
                    <h2>Cao đẳng - A</h2>
                    <p class="subDetails">Tốt nghiệp 3 - 2015</p>
                    <p>Mô tả</p>
                </article>
                <article>
                    <h2>Đại học - B</h2>
                    <p class="subDetails">Tốt nghiệp 3 - 2017</p>
                    <p>Mô tả</p>
                </article>
            `);
        selected_cv.html = selected_cv.html.replace('{{title_career_highlight}}', 'Thành tích nổi bật');
        selected_cv.html = selected_cv.html.replace('{{outstanding_achievement}}', 'Nêu thành tích nổi bật');
    }

    if (sheet) {
        sheet.parentNode.removeChild(sheet);
    }

    sheet = document.createElement('style');
    sheet.innerHTML = selected_cv.css;
    document.head.appendChild(sheet);

    jQuery('.content-cv-design').empty();
    jQuery('.content-cv-design').append(selected_cv.html);
    jQuery('.cv-template-name').text(selected_cv.name);

    jQuery('#cv-color').css('background-color', '#' + selected_cv.default_color);
    jQuery('.cv-template-container .mainDetails').css('background-color', '#' + selected_cv.default_color);
    jQuery('.cv-template-container .sectionTitle').css('color', '#' + selected_cv.default_color);

    jQuery('#cv_font').val(selected_cv.default_font_family);
    jQuery('#cv-font-size').val(selected_cv.default_font_size);

    jQuery('.cv-template-container').css('font-family', selected_cv.default_font_family);
    jQuery('.cv-template-container').css('font-size', selected_cv.default_font_size + 'px');

    jQuery('.creating-cv-step .first').removeClass('current');
    jQuery('.creating-cv-step .second').addClass('current');
    jQuery('.list-cv-step').addClass('hidden');
    jQuery('.design-cv-step').removeClass('hidden');
}

function renderExampleCV() {
    
}

jQuery('.experience-area').on('change', '.no-experience-cb', function() {
    var val = jQuery(this).prop('checked');
    if (val) {
        jQuery(this).parent().prev().val(0);
        jQuery(this).parent().prev().attr('disabled', true);
    } else {
        jQuery(this).parent().prev().attr('disabled', false);
    }
});

jQuery('.experience-input-area').on('click', '.removable', function() {
    jQuery(this).parent().remove();
});

jQuery('.education-input-area').on('click', '.removable', function() {
    jQuery(this).parent().remove();
});

jQuery('.skill-input-area').on('click', '.removable', function() {
    jQuery(this).parent().remove();
});