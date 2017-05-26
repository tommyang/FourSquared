/**
 * angular-ui-utils - Swiss-Army-Knife of AngularJS tools (with no external dependencies!)
 * @version v0.2.3 - 2015-03-30
 * @link http://angular-ui.github.com
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
!function(u,e){"use strict";var i=["ngInclude","ngPluralize","ngView","ngSwitch","uiCurrency","uiCodemirror","uiDate","uiEvent","uiKeypress","uiKeyup","uiKeydown","uiMask","uiMapInfoWindow","uiMapMarker","uiMapPolyline","uiMapPolygon","uiMapRectangle","uiMapCircle","uiMapGroundOverlay","uiModal","uiReset","uiScrollfix","uiSelect2","uiShow","uiHide","uiToggle","uiSortable","uiTinymce"];u.myCustomTags=u.myCustomTags||[],i.push.apply(i,u.myCustomTags);for(var a=function(u){var e=[],i=u.replace(/([A-Z])/g,function(u){return" "+u.toLowerCase()}),a=i.split(" ");if(1===a.length){var r=a[0];e.push(r),e.push("x-"+r),e.push("data-"+r)}else{var n=a[0],o=a.slice(1).join("-");e.push(n+":"+o),e.push(n+"-"+o),e.push("x-"+n+"-"+o),e.push("data-"+n+"-"+o)}return e},r=0,n=i.length;n>r;r++)for(var o=a(i[r]),t=0,l=o.length;l>t;t++){var s=o[t];e.createElement(s)}}(window,document);