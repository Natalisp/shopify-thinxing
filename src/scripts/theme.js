window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
// =require slate/a11y.js
// =require slate/cart.js
// =require slate/utils.js
// =require slate/rte.js
// =require slate/sections.js
// =require slate/currency.js
// =require slate/images.js
// =require slate/variants.js

/*================ Sections ================*/
// =require sections/product.js

/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js

$(document).ready(function() {


    console.log("qty");

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



  var sections = new slate.Sections();
  sections.register('product', theme.Product);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
});
