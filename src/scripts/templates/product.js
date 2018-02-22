/* =========================================================================
    Custom PDP script
========================================================================= */

// SLICK

if ($(".template-product").length) {

  $('.js-slick-slider').slick({
      arrows: false,
      dots: true
  });

// QUANTITY

  var $minus = $(".qty-selectors__btn--minus");
  var $plus  = $(".qty-selectors__btn--plus");
  var $qtyInput = $("[name='quantity']");
  var $qtyDisplay = $('.qty-selectors__qty');

  var qty = parseInt( $qtyInput.val() );
  var MIN = parseInt( $qtyInput.attr("min") );
  var MAX = parseInt( $qtyInput.attr("max") );

  var updateQty = function(qty){
      $qtyInput.val(qty).trigger("change");
      $qtyDisplay.text(qty);
  };

  $minus.on("click", function(){

      if(qty - 1 >= MIN){
          qty = qty - 1;
          updateQty(qty);
      }

  });

  $plus.on("click", function(){

      if(qty + 1 <= MAX){
          qty = qty + 1;
          updateQty(qty);
      }

  });


// SCROLL CHECK

  function scrolledCheck() {

    // run this only on desktops
      if (Modernizr.mq('(min-width: 749px)')) {

        var galleryHeight = $(".product-gallery-container").height();
        $(".scroll-container").css("height", galleryHeight);

        var fixedContainerWidth = $(".fixed-content").parent().width();

        $(".fixed-content").css("width", fixedContainerWidth);

        if ($(window).scrollTop() > (galleryHeight - $(window).height() ) ) {
            $(".fixed-content").removeClass("is-scrolling");
            $(".fixed-content").addClass('is-bottomed');
        } else {
          $(".fixed-content").removeClass('is-bottomed');
          $(".fixed-content").addClass("is-scrolling");
        }
      }

  }

  scrolledCheck();

  $(window).on('scroll', function() {
    scrolledCheck();
  });

}


// COLOR SELECT BUTTONS

 $(document).on('click', '.js-color-option-select', function() {

    var $this = $(this);
    $this.addClass('selected').siblings().removeClass('selected');

 });


// DROPDOWN

$(document).on('click', '.js-dropdown-toggle', function() {
    var $dropdown = $(this).parent();

    $dropdown.toggleClass('open')
            .siblings().removeClass('open');

});



// GALLERY ZOOM

// Helper function to toggle class in body

$(document).on('click', '.js-body-toggle-class', function() {
    $('body').toggleClass($(this).data('body-class'));
});


$(document).on('click', '.js-zoom-img', function() {
  var imageClicked = $(this).data("pdp-image-zoom");
  var imageToZoom = $('.product__zoom-gallery--toggled').find('#' + imageClicked);
  var scrollToElement = imageToZoom.offset().top;

  var $container = $('.product__zoom-gallery'),
      $scrollTo = $(imageToZoom);

  $container.scrollTop(
      $scrollTo.offset().top - $container.offset().top + $container.scrollTop()
  );

})


// Make links not clickable for presentation purpose only
$(".cta-link, .pdp-info-link").on('click', function(e){
  e.preventDefault();
})
