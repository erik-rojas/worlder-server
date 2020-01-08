
$( document ).ready(function() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    console.log('height win', w,h);

    let maxtime = 4000;

    // right
    $('.ads1').css('height', (h - 412.667 + 20)+'px')
    $('.ads1-item a').css('display', 'none');
    $('.ads1-item a:nth-child(1)').css('display', 'block');
    let count = $('.ads1-item a').length;
    setInterval(() => {
        let index = Math.floor(Math.random()*(count-1+1)+1);
        $('.ads1-item a').css('display', 'none');
        $('.ads1-item a:nth-child('+index+')').css('display', 'block');

    }, Math.floor(Math.random()*(maxtime+1-1500)+1500));

    // center
    let count2 = $('.ads2-item a').length;
    $('.ads2-item a').css('display', 'none');
    $('.ads2-item a:nth-child(1)').css('display', 'block');
    setInterval(() => {
        let index2 = Math.floor(Math.random()*(count2-1+1)+1);
        $('.ads2-item a').css('display', 'none');
        $('.ads2-item a:nth-child('+index2+')').css('display', 'block');

    }, Math.floor(Math.random()*(maxtime+1-3000)+3000));

    // top
    let count_top = $('.ads-top-item a').length;
    $('.ads-top-item a').css('display', 'none');
    $('.ads-top-item a:nth-child(1)').css('display', 'block');
    setInterval(() => {
        let index_top = Math.floor(Math.random()*(count_top-1+1)+1);
        $('.ads-top-item a').css('display', 'none');
        $('.ads-top-item a:nth-child('+index_top+')').css('display', 'block');

    }, Math.floor(Math.random()*(maxtime+1-3000)+3000));

    //center2
    let count3 = $('.ads3-item a').length;
    $('.ads3-item a').css('display', 'none');
    $('.ads3-item a:nth-child(1)').css('display', 'block');
    setInterval(() => {
        let index3 = Math.floor(Math.random()*(count3-1+1)+1);
        $('.ads3-item a').css('display', 'none');
        $('.ads3-item a:nth-child('+index3+')').css('display', 'block');

    }, Math.floor(Math.random()*(maxtime+1-3000)+3000));

    //pageview
    let count4 = ads_count || 1;
    $('.ads4-item a').css('display', 'none');
    $('.ads4-item a:nth-child(1)').css('display', 'block');
    setInterval(() => {
        console.log('ads4', count4);
        let index4 = Math.floor(Math.random()*(count4-1+1)+1);
        $('.ads4-item a').css('display', 'none');
        $('.ads4-item a:nth-child('+index4+')').css('display', 'block');

    }, Math.floor(Math.random()*(maxtime+1-3000)+3000));
    
    $('.ads2-item').on('click', '.ADS', function(){
    });
});