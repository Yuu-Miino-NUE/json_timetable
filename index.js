import {
    writeFileInput,
    writeFileOperate,
    writeLCRadios,
    writeFilter,
    showHTML,
    hideHTML,
    semesters,
    periods,
    days,
    writeWarning,
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
var sortState = 0;

/* ウィンドウ読み込み時の処理 */
window.onload = function () {
    /* HTML を配置 */
    writeFileInput('fileUpload', handleUploadFile, handleDownloadDummy);
    writeFileOperate('fileOperate', handleUploadFile, handleDownloadJSON, handleResetJSON);
    writeLCRadios('radiosGroup', handleRadioChange);
    writeFilter('filter', capitalState, handleAndOrRadioChange,  handleFilterKeyup, handleToggleCapital);
}

/***** イベント関数 *****/
/* 大文字小文字切り替えトグル */
function handleToggleCapital (event) {
    capitalState = event.target.checked;
    event.target.blur();
    writeAllDynamicHTML();
}

/* フィルタ文字列入力 */
function handleFilterKeyup (event) {
    const text = event.target.value.replace(/　/g," ");
    if (text.length == 0) {
        filterList = [];
    }
    filterList = [...new Set(text.split(" "))];
    writeAllDynamicHTML();
}

/* ファイルアップロード */
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

/* ファイルダウンロード */
function handleDownloadJSON() {
    var dataStr = "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(keyFilter.map(i=>json[i]), null, '\t'));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "timetable.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

/* ダミーファイルダウンロード */
function handleDownloadDummy() {
    var dataStr = "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(makeDummy(), null, '\t'));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "dummy.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

/* JSON 削除， HTML 非表示化 */
function handleResetJSON () {
    json = [];
    keyFilter = [];
    filterList = [];
    lcState = 0;
    andOrState = 'and';
    capitalState = false;
    sortState = 0;

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

/* ソート切替 */
function handleToggleSort (event) {
    switch (Number(event.target.value)) {
        case 0: timeSort(); break;
        case 1: subjectSort(); break;
        default: console.log('undefined sort: '+event.target.value); break;
    }
    sortState = Number(event.target.value);
    writeAllDynamicHTML();
}

/* json から 項目を削除 */
function handleDeleteItem(index) {
    json.splice(index, 1)
    writeAllDynamicHTML();
}

/* json の項目を差替 */
function handleReplaceItem(index){
    const newVal = JSON.parse(document.getElementById('newJson'+index).value);
    json[index] = newVal;
    writeAllDynamicHTML();
}

/* リスト・カレンダー切替 */
function handleRadioChange(event){
    switch(Number(event.target.value)) {
        case 0:
            hideHTML('calendar');
            showHTML('list');
            break;
        case 1:
            hideHTML('list');
            showHTML('calendar');
            break;
        default: console.log('undefined list/calendar radio: '+event.target.value); break;
    }
    lcState = Number(event.target.value);
    event.target.blur()
}

/* AND/OR 切替 */
function handleAndOrRadioChange (event) {
    andOrState = event.target.value;
    writeAllDynamicHTML();
    event.target.blur()
}

/*** まとめ処理系 ***/
/* HTML 描画まとめ */
function writeAllDynamicHTML () {
    refreshFilter();
    writeList('list', json, keyFilter, sortState, handleToggleSort);
    writeCalendar('calendar', json, keyFilter);
    writeModals('modals', json, keyFilter, handleDeleteItem, handleReplaceItem);
}

/* 変数：json が更新されたときの処理まとめ */
function setUpJSON(){
    writeWarning('jsonWarning', json);
    timeSort();
    writeAllDynamicHTML();
    hideHTML('fileUpload');
    showHTML('fileOperate');
    showHTML('radiosGroup');
    showHTML('filter');
    switch (lcState) {
        case 0: showHTML('list'); break;
        case 1: showHTML('calendar'); break;
        default: break;
    }
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

/* 時系列ソート */
function timeSort() {
    json.sort((a, b)=>{
        const amin = Math.min([...new Set(a.times.map(r=>r.day))].map(r=>days.indexOf(r)));
        const bmin = Math.min([...new Set(b.times.map(r=>r.day))].map(r=>days.indexOf(r)));
        if (amin > bmin) return 1;
        if (amin == bmin) return 0;
        if (amin < bmin) return -1;
    }).sort((a, b)=>{
        if (a.times.some(r=>r.semester == semesters[0]) && !b.times.some(r=>r.semester == semesters[0])) {
            return -1;
        }
        if (!a.times.some(r=>r.semester == semesters[0]) && b.times.some(r=>r.semester == semesters[0])) {
            return 1;
        }
        return 0;
    }).sort((a, b)=>{
        if (a.year > b.year) return 1;
        if (a.year == b.year) return 0;
        if (a.year < b.year) return -1;
    });
}

/* 科目番号ソート */
function subjectSort() {
    json.sort((a, b)=>{
        if (a.subject > b.subject) return 1;
        if (a.subject == b.subject) return 0;
        if (a.subject < b.subject) return -1;
    })
}

/* ダミーデータ作成 */
function makeDummy () {
    const dummy = [];
    const dummyYear = [2023, 2024];
    const dummyRooms = ['B101', 'B102', 'B103', 'B104', 'C101', 'C102', 'C103', 'C104'];
    const dummyLecturers = ['山田', '田中', '森', '近藤', '井上', '竹内', '木下', '本田'];

    function randomInt (max, min=0) {
        return min+Math.floor(Math.random() * (max-min))
    }

    for (var i=0; i < 56; i++) {
        const dy = dummyYear[randomInt(dummyYear.length)];
        const shuffled = dummyLecturers.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, randomInt(4, 1));
        const pIndex = randomInt(periods.length);
        dummy.push({
            year: dy,
            times: [{
                semester: semesters[randomInt(2, 0)],
                day:      days[randomInt(days.length)],
                periods:  [...periods].slice(pIndex, pIndex+randomInt(3, 1)),
            }],
            subject:  randomInt(dy * 10000 + 3000, dy * 10000),
            room:     dummyRooms[randomInt(dummyRooms.length)],
            lecturers: selected
        });
    }
    for (var i=0; i < 8; i++) {
        const dy = dummyYear[randomInt(dummyYear.length)];
        const shuffled = dummyLecturers.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, randomInt(4, 1));
        const pIndex = randomInt(periods.length);
        dummy.push({
            year: dy,
            times: [
                {
                    semester: semesters[0],
                    day:      days[randomInt(days.length)],
                    periods:  [...periods].slice(pIndex, pIndex+randomInt(3, 1)),
                },
                {
                    semester: semesters[1],
                    day:      days[randomInt(days.length)],
                    periods:  [...periods].slice(pIndex, pIndex+randomInt(3, 1)),
                }
            ],
            subject:  randomInt(dy * 10000 + 3000, dy * 10000),
            room:     dummyRooms[randomInt(dummyRooms.length)],
            lecturers: selected
        });
    }
    return dummy;
}