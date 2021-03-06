(function ( global, factory ) {
    'use strict';

    if ( typeof define === 'function' && define.amd ) {
        // AMD (Register as an anonymous module)
        define('autocjs', [ 'jquery' ], factory( global, $ ) );
    }
    else {
        
        if ( typeof define === 'function' && define.cmd ) {
            // CMD (Register as an anonymous module)
            define( 'autocjs', function ( require, exports, module ) {
                module.exports = factory( global, require( 'jquery' ) );
            } );
        }
        else {
            
            if ( typeof exports === 'object' ) {
                // Node/CommonJS
                module.exports = factory( global, require( 'jquery' ) );
            }
            else {
                // Browser globals
                factory( global, jQuery );
            }
        }
    }
}( typeof window !== "undefined" ? window : this, function ( window, $ ) {
    'use strict';
    
    var CLS_SHOW = 'toc-show',
        CLS_HIDE = 'toc-hide',
        WRAP = '<div id="toc" class="toc toc-hide"></div>',
        TITLE = '<h3 class="toc-title" id="toc-title">Table of Contents</h3>',
        BAR = '<div class="toc-bar"></div>',
        SWITCH = '<h2 class="toc-switch" class="toc-switch" title="Toggle Menu">&#926;</h2>',
        TOP = '<a class="toc-top" id="toc-top" href="#top">TOP</a>',
        BODY = '<nav id="toc-bd" class="toc-bd"></nav>',
        LIST = '<ol id="toc-list" class="toc-list"></ol>',
        SUB_LIST = '<ol class="toc-sub-list"></ol>',
        ITEM = '<li class="toc-item"></li>',
        LINK = '<a></a>',
        CHAPTER = '<em class="toc-chapter"></em>',
        OVERLAY = '<div id="toc-overlay" class="toc-overlay toc-hide"></div>',
        ANCHORS = 'h1,h2,h3,h4,h5,h6',
        PREFIX = 'anchor',
        $article = null,
        $anchors = null,
        $wrap = null,
        $title = null,
        $bar = null,
        $switch = null,
        $top = null,
        $body = null,
        $list = null,
        $overlay = null,
        _uid = -1;
    
    /**
     * ??????????????? id
     *
     * @method guid
     * @param {String} [prefix] - ???????????????????????????ID???????????? prefix ??????????????????ID
     * @returns {Number|String}
     */
    function guid ( prefix ) {
        var id;
        
        _uid += 1;
        id = prefix ? prefix + '-' + _uid : _uid;
        
        return id;
    }


    var AutocJS = {
        version: '0.1.2',
        /**
         * Default Configration
         */
        defaults: {
            article: '#article',
            Templates: {
                WRAP: WRAP,
                TITLE: TITLE,
                BAR: BAR,
                SWITCH: SWITCH,
                TOP: TOP,
                BODY: BODY,
                LIST: LIST,
                SUB_LIST: LIST,
                ITEM: ITEM,
                LINK: LINK,
                CHAPTER: CHAPTER,
                OVERLAY: OVERLAY
            },
            selector: ANCHORS,
            prefix: PREFIX
        },
        attributes: {},
        /**
         * ??????????????????
         *
         * @param config
         * @returns {AutocJS}
         */
        set: function ( config ) {

            if ( $.isPlainObject( config ) ) {
                $.extend( this.attributes, config );
            }

            return this;
        },
        /**
         * ???????????????
         *
         * @param {Object} config - ????????????
         * @param {String|HTMLElement} config.article
         * @param {String} [config.selector]
         * @param {String} [config.prefix]
         */
        init: function ( config ) {
            this.set( this.defaults )
                .set( config )
                ._init()
                .render()
                .attachEvents();

            return this;
        },
        /**
         * ????????? DOM ??????
         *
         * @returns {AutocJS}
         * @private
         */
        _init: function () {
            var attrs = this.attributes,
                Templates = attrs.Templates;

            // ????????????????????? DOM ??????
            $article = $( attrs.article );

            // ??????????????????????????????
            $anchors = $article.find( attrs.selector );

            // ????????? DOM ??????
            $wrap = $( Templates.WRAP );
            $title = $( Templates.TITLE );
            $bar = $( Templates.BAR );
            $switch = $( Templates.SWITCH );
            $top = $( Templates.TOP );
            $body = $( Templates.BODY );
            $list = $( Templates.LIST );
            $overlay = $( Templates.OVERLAY );

            return this;
        },
        /**
         * ??????????????????
         *
         * @returns {AutocJS}
         */
        render: function () {

            // ??????head
            $bar.append( $switch ).append( $top );

            // ??????body
            $body.append( $list );

            // ?????????????????????
            $wrap.append( $title ).append( $body ).append( $bar );

            // ????????????????????????????????????
            $( document.body ).append( $wrap ).append( $overlay );

            // ????????????????????????
            this.renderChapters();

            // ?????????????????????????????????????????????
            $wrap.removeClass( CLS_HIDE );

            // ?????????????????????
            this.updateLayout();

            return this;
        },
        /**
         * ??????????????????
         *
         * @returns {AutocJS}
         */
        renderChapters: function () {
            var chapters = this.getChapters();

            $( chapters ).each( function ( i, chapter ) {

                var $item = $( ITEM ),
                    $parent = null,
                    $link = $( LINK ),
                    chapterText = '',
                    chapterCount = 0,
                    $chapter = $( CHAPTER ),
                    $sublist = $( '#toc-list-' + chapter.pid );

                $link.attr( {
                    id: 'toc-link-' + chapter.id,
                    href: '#' + chapter.value
                } ).html( chapter.text );

                $item.attr( {
                    'id': 'toc-item-' + chapter.id,
                    'title': chapter.text
                } ).append( $link );

                if ( chapter.pid === -1 ) {
                    $list.append( $item );
                    chapterCount = $item.index() + 1;
                    chapterText = chapterCount;
                }
                else {

                    $parent = $( '#toc-item-' + chapter.pid );

                    // ????????????????????????????????????
                    if ( !$sublist[ 0 ] ) {
                        $sublist = $( SUB_LIST ).attr( 'id', 'toc-list-' + chapter.pid );

                        $parent.append( $sublist );
                    }

                    $sublist.append( $item );

                    // ??????????????????
                    chapterCount = $item.index() + 1;
                    chapterText = $parent.find( '.toc-chapter' ).html() + '.' + chapterCount;
                }

                // ????????????
                $chapter.attr( 'data-chapter', chapterCount ).html( chapterText );
                $chapter.insertBefore( $link );
            } );

            return this;
        },
        /**
         * ????????????
         *
         * @returns {AutocJS}
         */
        show: function () {
            $overlay.removeClass( CLS_HIDE );

            $wrap.animate( {
                left: 0
            }, 150, function () {
                $wrap.addClass( CLS_SHOW );
            } );

            return this;
        },
        /**
         * ????????????
         */
        hide: function () {

            $wrap.animate( {
                left: -300
            }, 150, function () {
                $overlay.addClass( CLS_HIDE );
                $wrap.removeClass( CLS_SHOW );
            } );

            return this;
        },
        /**
         * ??????/????????????
         */
        toggle: function () {

            if ( $wrap.hasClass( CLS_SHOW ) ) {
                this.hide()
            }
            else {
                this.show();
            }

            return this;
        },
        /**
         * ????????????????????????
         *
         * @returns {AutocJS}
         */
        updateLayout: function () {
            var wrapHeight = $wrap[ 0 ].offsetHeight,
                titleHeight = $title[ 0 ].offsetHeight;

            $body.height( wrapHeight - titleHeight );

            return this;
        },
        /**
         * ???????????????????????????????????????
         *
         * @returns {Array}
         */
        getChapters: function () {
            var self = this,
                chapters = [],
                prevNum = 1,
                level = 0;

            // ????????????????????????
            $anchors.each( function ( i, anchor ) {
                var $anchor = $( anchor ),
                    curNum = parseInt( $anchor[ 0 ].tagName.toUpperCase().replace( /[H]/ig, '' ), 10 ),
                    pid = -1;

                $anchor.attr( 'id', guid( self.attributes.prefix ) );

                // 1.??????????????????????????????????????????????????? > ????????????????????????
                if ( curNum > prevNum ) {
                    level += 1;

                    // ??????????????? pid ??? -1
                    if ( level === 1 ) {
                        pid = -1;
                    }
                    else {
                        pid = i - 1;
                    }
                }
                else {
                    // 2.?????????????????????????????????
                    // A. ????????????????????? === ????????????????????????
                    // B. ????????????????????? < ???????????????????????? && ????????????????????? > ??????
                    if ( curNum === prevNum || (curNum < prevNum && curNum > level) ) {

                        // H1 ?????????????????? 1
                        if ( curNum === 1 ) {
                            level = 1;

                            pid = -1;
                        }
                        else {
                            pid = chapters[ i - 1 ].pid;
                        }
                    }
                    else {
                        // 3.?????????????????????????????????????????????????????? < ????????????????????????
                        if ( curNum <= level ) {

                            // H1 ?????????????????? 1
                            if ( curNum === 1 ) {
                                level = 1;
                            }
                            else {
                                level = level - (prevNum - curNum);
                            }

                            // ??????????????????
                            if ( level === 1 ) {
                                pid = -1
                            }
                            else {
                                // ????????????5????????????
                                // ??????????????????????????????????????????
                                switch ( prevNum - curNum ) {
                                    case 1:
                                        pid = chapters[ chapters[ i - 1 ].pid ].pid;
                                        break;
                                    case 2:
                                        pid = chapters[ chapters[ chapters[ i - 1 ].pid ].pid ].pid;
                                        break;
                                    case 3:
                                        pid = chapters[ chapters[ chapters[ chapters[ i - 1 ].pid ].pid ].pid ].pid;
                                        break;
                                    case 4:
                                        pid = chapters[ chapters[ chapters[ chapters[ chapters[ i - 1 ].pid ].pid ].pid ].pid ].pid;
                                        break;
                                    case 5:
                                        pid = chapters[ chapters[ chapters[ chapters[ chapters[ chapters[ i - 1 ].pid ].pid ].pid ].pid ].pid ].pid;
                                        break;
                                }
                            }
                        }
                    }
                }

                prevNum = curNum;

                chapters.push( {
                    id: i,
                    level: level,
                    text: $anchor.html(),
                    value: $anchor.attr( 'id' ),
                    tag: anchor.tagName,
                    pid: pid
                } );
            } );

            return chapters;
        },
        /**
         * ???????????????????????????
         *
         * @returns {HTMLElement}
         */
        getAnchors: function(){
            return $anchors;
        },
        /**
         * ???????????????????????? DOM
         *
         * @returns {HTMLElement}
         */
        getWrap: function(){
            return $wrap;
        },
        /**
         * ???????????????????????????
         *
         * @returns {HTMLElement}
         */
        getTitle: function(){
            return $title;
        },
        /**
         * ??????????????????????????????
         *
         * @returns {HTMLElement}
         */
        getBar: function(){
            return $bar;
        },
        /**
         * ??????????????????
         *
         * @returns {HTMLElement}
         */
        getSwitchButton: function(){
            return $switch;
        },
        /**
         * ????????????????????????
         *
         * @returns {HTMLElement}
         */
        getTopButton: function(){
            return $top;
        },
        /**
         * ????????????????????????
         *
         * @returns {HTMLElement}
         */
        getBody: function(){
            return $body;
        },
        /**
         * ??????????????????
         *
         * @returns {HTMLElement}
         */
        getList: function(){
            return $list;
        },
        /**
         * ?????????????????????
         *
         * @returns {HTMLElement}
         */
        getOverlay: function(){
            return $overlay;
        },
        /**
         * ???????????????????????? DOM ???????????????????????????
         *
         * @returns {AutocJS}
         */
        attachEvents: function () {

            // ???????????????????????????/??????????????????
            $switch.on( 'click', this._onSwitchClick );

            // ??????TOP???????????????????????????
            $top.on( 'click', this._onTopClick );

            // ??????????????????????????????????????????
            $list.delegate( 'li', 'click', this._onChapterClick );

            // ??????????????????????????????
            $overlay.on( 'click', this._onOverlayClick );

            $( window ).on( 'resize', this._onWindowResize );

            return this;
        },
        /**
         *
         * @param evt
         * @returns {AutocJS}
         * @private
         */
        _onSwitchClick: function(evt){
            AutocJS.toggle();

            evt.stopPropagation();
            evt.preventDefault();

            return AutocJS;
        },
        /**
         *
         * @param evt
         * @returns {AutocJS}
         * @private
         */
        _onTopClick: function(evt){
            AutocJS.hide();

            evt.stopPropagation();
            evt.preventDefault();

            return AutocJS;
        },
        /**
         *
         * @param evt
         * @returns {AutocJS}
         * @private
         */
        _onChapterClick: function(){
            AutocJS.hide();

            return AutocJS;
        },
        /**
         *
         * @param evt
         * @returns {AutocJS}
         * @private
         */
        _onOverlayClick: function(evt){
            AutocJS.hide();

            evt.stopPropagation();
            evt.preventDefault();

            return AutocJS;
        },
        /**
         *
         * @returns {AutocJS}
         * @private
         */
        _onWindowResize: function(){
            AutocJS.updateLayout();

            return AutocJS;
        }
    };

    // ??? autoc ??????????????? jquery ??????
    $.extend( $.fn, {
        autoc: function ( selector, prefix ) {
            var self = this,
                config = {
                    article: self,
                    selector: selector,
                    prefix: prefix
                };

            AutocJS.init( config );
        }
    } );

    window.AutocJS = AutocJS;
    window.autoc = function(config){
       AutocJS.init(config);
    };
    
    return AutocJS;
} ));