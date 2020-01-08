(function($) {
    var ctl = $("form.formData").attr("controller");
    var base64;
    $('#cv_file').change(function(){
        var file = this.files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
            base64=reader.result;
            console.log('base', base64);
        }
        reader.readAsDataURL(file);
    });

    $('.btn-apply-job').on('click', function(){
        console.log('clickedđ' );
    })
   
})(jQuery);

