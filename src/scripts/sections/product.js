/* =========================================================================
    Custom PDP script
========================================================================= */


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


// Scroll Check

  function scrolledCheck() {

      if (Modernizr.mq('(min-width: 749px)')) {

        var galleryHeight = $(".product-gallery-container").height();
        $(".scroll-container").css("height", galleryHeight)
        // Might have to add loop
        var fixedContainerWidth = $(".fixed-content").parent().width();

        $(".fixed-content").css("width", fixedContainerWidth);

        if ($(window).scrollTop() >= (galleryHeight - $(window).height()) ) {
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


// Color Select btns

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



// ZOOM

// Helper function to toggle class in body

$(document).on('click', '.js-body-toggle-class', function() {
    $('body').toggleClass($(this).data('body-class'));
});


$(document).on('click', '.js-zoom-img', function() {
  var imageClicked = $(this).data("pdp-image-zoom");
  var imageToZoom = $('.product__zoom-gallery--toggled').find('#' + imageClicked);
  var scrollToElement = imageToZoom.offset().top;
  console.log(scrollToElement);

  var $container = $('.product__zoom-gallery'),
      $scrollTo = $(imageToZoom);

  $container.scrollTop(
      $scrollTo.offset().top - $container.offset().top + $container.scrollTop()
  );

})



/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Product = (function() {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    productThumbs: '[data-product-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]'
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    var sectionId = this.$container.attr('data-section-id');
    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());

    var options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject
    };

    this.settings = {};
    this.namespace = '.product';
    this.variants = new slate.Variants(options);
    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);

    this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
    this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));

    if (this.$featuredImage.length > 0) {
      this.settings.imageSize = slate.Image.imageSize(this.$featuredImage.attr('src'));
      slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);

      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
    }
  }

  Product.prototype = $.extend({}, Product.prototype, {

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */


    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      if (variant) {
        $(selectors.priceWrapper, this.$container).removeClass('hide');
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(selectors.priceWrapper, this.$container).addClass('hide');
        return;
      }

      if (variant.available) {
        $(selectors.addToCart, this.$container).prop('disabled', false);
        $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {
      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);

      $(selectors.productPrice, this.$container)
        .html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $compareEls.removeClass('hide');
      } else {
        $comparePrice.html('');
        $compareEls.addClass('hide');
      }
    },


    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;
      var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);

      this.$featuredImage.attr('src', sizedImgUrl);
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }
  });

  return Product;
})();
