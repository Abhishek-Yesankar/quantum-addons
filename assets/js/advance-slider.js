class advanceSlider extends elementorModules.frontend.handlers.SwiperBase  {
   getDefaultSettings()  {
      return {
         selectors: {
            container: ".el-quantum-advance-slider-container",
         },
      }
   }

   getDefaultElements()  {
      const selectors = this.getSettings( "selectors" );

      return {
         $container: this.$element.find( selectors.container ),
      }
   }

   onInit()  {
      this.initSwiper( this.getDefaultElements().$container );
   }

   async initSwiper( el )  {
      let swiperConfig = this.getSwiperConfig();

      /// Swiper elementor internal library
      const Swiper = elementorFrontend.utils.swiper;
      const newSwiperInstance = await new Swiper( el, swiperConfig );

      ///adding swiper instance to container with Jquery data function
      ///P.S i don't know why anyone will need this, but just leaving it right here for now
      this.getDefaultElements().$container.data( "swiper", newSwiperInstance );
   }

   getSwiperConfig()  {
      ///all the elements settings
      const settings = this.getElementSettings();
      const elementorBreakpoints = elementorFrontend.config.responsive.activeBreakpoints;
      const desktopSlideToShow = +settings['slide_per_view'];
      const desktopCenterSlides = +settings['center_slide'] ? true : false;
      const desktopSpaceBetween = +settings['space_between'];
      const desktopSlidePerGroup = +settings['slide_per_group'];
      const isPaginationClickable = settings['is_pagination_clickable'] === 'yes' ? true : false;
      const paginationType = settings['pagination_type'];
      const isScrollbarDraggable = settings['is_scrollbar_draggable'] === 'yes' ? true : false;

      let customNextBtn = settings['custom_navigation_next_button_selector'];
      let customPrevBtn = settings['custom_navigation_prev_button_selector'];
      let customPagination = settings['custom_pagination_selector'];
      let customScrollbar = settings['custom_scrollbar_selector'];

      if( typeof customNextBtn === 'string' )  customNextBtn = customNextBtn.trim();

      if( typeof customPrevBtn === 'string' )  customPrevBtn = customPrevBtn.trim();

      if( typeof customPagination === 'string' )  customPagination = customPagination.trim();

      if( typeof customScrollbar === 'string' )  customScrollbar = customScrollbar.trim();

      ///add swiper scrollbar css class to custom scrollbar
      if( customScrollbar )  {
         const scrollbarEl = document.querySelector( customScrollbar );
         if( scrollbarEl )  scrollbarEl.classList.add( 'swiper-scrollbar' );
      }

      ///basic swiper config
      const swiperConfig = {
         direction: "horizontal",
         loop: settings["loop"] ? true : false,
         slidesPerView: desktopSlideToShow,
         centeredSlides: desktopCenterSlides,
         spaceBetween: desktopSpaceBetween,
         slidesPerGroup: desktopSlidePerGroup,
         pagination: {
            el: customPagination ? customPagination : ".swiper-pagination",
            clickable: isPaginationClickable,
            type: paginationType,
         },
         navigation: {
            nextEl: customNextBtn ? customNextBtn : '.el-quantum-next-btn',
            prevEl: customPrevBtn ? customPrevBtn : '.el-quantum-prev-btn',
         },
         scrollbar: {
            el: customScrollbar ? customScrollbar : ".el-quantum-slider-scrollbar",
            draggable: isScrollbarDraggable,
         },
         breakpoints: {},
         ///i saw this code in Elementor source code and this seems to
         ///"correct" the breakpoints according to swiper breakpoints
         handleElementorBreakpoints: true,
      }

      ////add breakpoints values to swiper config
      Object.keys( elementorBreakpoints ).reverse().forEach( ( breakpointName ) =>  {
			swiperConfig.breakpoints[ elementorBreakpoints[ breakpointName ].value ] =  {
				slidesPerView: +settings['slide_per_view_' + breakpointName],
            centeredSlides: +settings['center_slide_' + breakpointName] ? true : false,
				spaceBetween: +settings['space_between_' + breakpointName],
				slidesPerGroup: +settings['slide_per_group_' + breakpointName],
			}
		});

      return swiperConfig;
   }
}

jQuery( window ).on( "elementor/frontend/init", () =>  {
   const addHandler = ( $element ) => {
      elementorFrontend.elementsHandler.addHandler( advanceSlider, { $element } );
   };

   elementorFrontend.hooks.addAction(
      "frontend/element_ready/Advance_slider.default",
      addHandler
   );
});
