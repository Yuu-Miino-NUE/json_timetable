import {
    writeFileInput,
    writeFileOperate,
    writeLCRadios,
    writeFilter,
    showHTML,
    hideHTML,
    semesters,
    days,
    checkJSON,
    writeCalendar,
    writeList,
    writeModals
} from './statics.js';

/* グローバル変数 */
var json = [];
var keyFilter = []; // Key のみ保存
var lcState = 0;
var andOrState = 'and';
var capitalState = false;
var filterList = [];

/* ウィンドウ読み込み時の処理 */
window.onload = function () {
    /* HTML を配置 */
    writeFileInput('fileUpload', handleUploadFile);
    writeFileOperate('fileOperate', handleUploadFile, handleDownloadJSON, handleResetJSON);
    writeLCRadios('radiosGroup', handleRadioChange);
    writeFilter('filter', capitalState, handleAndOrRadioChange,  handleFilterKeyup, handleToggleCapital);
}

/***** Event handlers *****/
/* 大文字小文字切り替えトグル */
function handleToggleCapital (event) {
    capitalState = event.target.checked;
    event.target.blur();
    writeAllDynamicHTML();
}

/* 文字列入力の処理 */
function handleFilterKeyup (event) {
    const text = event.target.value.replace(/　/g," ");
    if (text.length == 0) {
        filterList = [];
    }
    filterList = [...new Set(text.split(" "))];
    writeAllDynamicHTML();
}

/* フィルタ更新 */
function refreshFilter() {
    if (json.length == 0 || filterList.length == 0) {
        keyFilter = json.length == 0 ? [] : [...json.keys()];
        return;
    }
    keyFilter = json.map((_, i)=>i).filter(i=>{
        var data = JSON.stringify(json[i]);
        if (!capitalState) {
            switch (andOrState) {
                case 'and':
                    return !filterList.some(f=>!data.toLowerCase().includes(f.toLowerCase()));
                case 'or':
                    return filterList.some(f=>data.toLowerCase().includes(f.toLowerCase()));
            }
        } else {
            switch (andOrState) {
                case 'and':
                    return !filterList.some(f=>!data.includes(f));
                case 'or':
                    return filterList.some(f=>data.includes(f));
            }
        }
    });
}

/* ファイルアップロード時の処理 */
function handleUploadFile(event) {
    if (event.target.files.length == 0) {
        console.log('no file selected');
        return;
    }
    for (var i = 0; i < event.target.files.length; i++) {
        var reader = new FileReader();
        reader.onload = (e)=>{
            try {
                json.push(...JSON.parse(e.target.result));
                setUpJSON();
                event.target.classList.remove('is-invalid');
            } catch (err) {
                console.log('invalid-json');
                event.target.classList.add('is-invalid');
                return;
            }
        };
        reader.readAsText(event.target.files[i]);
    }
    event.target.value = null;
}

/* ボタンクリックでファイルダウンロードのイベントをトリガ */
function handleDownloadJSON() {
    var dataStr = "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(keyFilter.map(i=>json[i])));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "timetable.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

/* JSON を削除して HTML を非表示化 */
function handleResetJSON () {
    json = [];
    keyFilter = [];
    filterList = [];
    lcState = 0;
    andOrState = 'and';
    capitalState = false;

    writeLCRadios('radiosGroup', handleRadioChange);
    writeFilter('filter', capitalState, handleAndOrRadioChange,  handleFilterKeyup, handleToggleCapital);
    writeAllDynamicHTML();
    showHTML('fileUpload');
    hideHTML('fileOperate');
    hideHTML('radiosGroup');
    hideHTML('filter');
    hideHTML('list');
    hideHTML('calendar');
}

/* HTML 描画まとめ */
function writeAllDynamicHTML () {
    console.log('refresh filter...');
    refreshFilter();
    console.log('write list...');
    writeList('list', json, keyFilter, handleTimeSort, handleSubjectSort);
    console.log('refresh calendar...');
    writeCalendar('calendar', json, keyFilter);
    console.log('write modals...');
    writeModals('modals', json, keyFilter, handleDeleteItem, handleReplaceItem);
}

/* 変数：json が更新されたときの処理まとめ */
function setUpJSON(){
    console.log('check json...');
    checkJSON('jsonWarn', json);
    console.log('write all dynamic HTML...');
    writeAllDynamicHTML();
    console.log('hide file upload...');
    hideHTML('fileUpload');
    console.log('show file operate...');
    showHTML('fileOperate');
    console.log('show radios group...');
    showHTML('radiosGroup');
    console.log('show filter...');
    showHTML('filter');
    switch (lcState) {
        case 0: showHTML('list'); break;
        case 1: showHTML('calendar'); break;
        default: break;
    }
}

/* 時系列ソート */
function handleTimeSort() {
    json.sort((a, b)=>{
        const amin = Math.min([...new Set(a.time.map(r=>r.day))].map(r=>days.indexOf(r)));
        const bmin = Math.min([...new Set(b.time.map(r=>r.day))].map(r=>days.indexOf(r)));
        if (amin > bmin) return 1;
        if (amin == bmin) return 0;
        if (amin < bmin) return -1;
    }).sort((a, b)=>{
        if (a.time.some(r=>r.semester == semesters[0]) && !b.time.some(r=>r.semester == semesters[0])) {
            return -1;
        }
        if (!a.time.some(r=>r.semester == semesters[0]) && b.time.some(r=>r.semester == semesters[0])) {
            return 1;
        }
        return 0;
    }).sort((a, b)=>{
        if (a.year > b.year) return 1;
        if (a.year == b.year) return 0;
        if (a.year < b.year) return -1;
    });
    writeAllDynamicHTML();
}

/* 科目番号ソート */
function handleSubjectSort() {
    json.sort((a, b)=>{
        if (a.subject > b.subject) return 1;
        if (a.subject == b.subject) return 0;
        if (a.subject < b.subject) return -1;
    })
    writeAllDynamicHTML();
}

/* json から 項目を削除 */
function handleDeleteItem(index) {
    json.splice(index, 1)
    writeAllDynamicHTML();
}

/* json の項目を差し替え */
function handleReplaceItem(index){
    const newVal = JSON.parse(document.getElementById('newJson'+index).value);
    json[index] = newVal;
    writeAllDynamicHTML();
}

/* リスト・カレンダー切替処理 */
function handleRadioChange(event){
    switch(event.target.value) {
        case '0':
            hideHTML('calendar');
            showHTML('list');
            break;
        case '1':
            hideHTML('list');
            showHTML('calendar');
            break;
        default: console.log('undefined list/calendar radio: '+event.target.value); break;
    }
    lcState = event.target.value;
    event.target.blur()
}

/* AND/OR 切替処理 */
function handleAndOrRadioChange (event) {
    andOrState = event.target.value;
    writeAllDynamicHTML();
    event.target.blur()
}
