/* グローバル変数 */
var json = [];
var jsonFiltered = []; // Key のみ保存
var radioState = null;
var andOrState = 'and';
var capitalState = false;
const semesters = ['前', '後'];
const days = ['月', '火', '水', '木', '金'];
const periods = [1, 2, 3, 4, 5];

/* ウィンドウ読み込み時の処理 */
window.onload = function () {
    /* HTML を準備 */
    writeFileInput();
    writeFileOperate();
    writeRadios();
    writeFilter();

    /* DOM にイベントリスナを設定 */
    document.getElementById("formFile").addEventListener("change", handleUploadFile);
    document.querySelectorAll("input[name='btnradio']").forEach((dom)=>(
        dom.addEventListener('change', handleRadioChange)
    ));
    document.querySelectorAll("input[name='andOrRadios']").forEach((dom)=>(
        dom.addEventListener('change', handleAndOrRadioChange)
    ));
    document.getElementById("filterInput").addEventListener("keyup", writeAllHTML);
    document.getElementById("capital").addEventListener("change", handleToggleCapital);
}

/* ファイルアップロード用 HTML を準備 */
function writeFileInput () {
    const fileInput =
        '<input class="form-control" type="file" id="formFile" accept=".json" hidden multiple>'+
        '<button class="btn btn-primary" style="width: 120pt" id="btnUploadFile" onclick="handleClickUpload()">'+
        '<i class="bi bi-file-earmark-arrow-up me-1"></i>アップロード</button>'+
        '<div class="invalid-feedback pt-2">ファイル読み込みに失敗しました．フォーマットを確認してください．</div>';
    document.getElementById('fileUpload').innerHTML = fileInput;
}

/* ファイル操作用 HTML を準備 */
function writeFileOperate () {
    const fileOperate =
        '<button class="btn btn-outline-primary me-3" id="btnAddFile" onclick="handleClickUpload()">'+
        '<i class="bi bi-file-earmark-plus-fill me-1"></i>JSON 追加</button>'+
        '<button class="btn btn-outline-secondary me-3" id="btnDownloadFile" onclick="handleClickDownload()">'+
        '<i class="bi bi-file-earmark-arrow-down-fill me-1"></i>JSON 保存</button>'+
        '<button class="btn btn-outline-danger" id="btnResetJSON" onclick="handleResetJSON()">'+
        '<i class="bi bi-trash-fill me-1"></i>リセット</button>'+
        '<div class="invalid-feedback pt-2">ファイル読み込みに失敗しました．フォーマットを確認してください．</div>';
    document.getElementById('fileOperate').innerHTML = fileOperate;
}

/* 文字列検索用 HTML を準備 */
function writeFilter () {
    const filter = '<div class="input-group">'+
    '<input type="text" class="form-control" id="filterInput" placeholder="検索キーワード"></input>'+
    [{id: 'radioAnd', value: 'and', label: 'AND 検索'}, {id: 'radioOr', value: 'or', label: 'OR 検索'}].map((v, i)=>(
        '<input class="btn-check" type="radio" name="andOrRadios" '+
        'id="'+v.id+'" value="'+v.value+'" '+(i==0?'checked':'')+'>'+
        '<label class="btn btn-outline-secondary" for="'+v.id+'">'+v.label+'</label>'
    )).join('')+
    '<input class="btn-check" type="checkbox" name="capital" id="capital" '+(capitalState?'checked':'')+'>'+
    '<label class="btn btn-outline-secondary" for="capital">大文字区別</label>'+
    '</div>';

    document.getElementById('filter').innerHTML = filter;
}

/* 大文字小文字切り替えトグル */
function handleToggleCapital (event) {
    capitalState = event.target.checked;
    event.target.blur();
    writeAllHTML();
}

/* 文字列でフィルタリング */
function filterJSON () {
    const text = document.getElementById('filterInput').value.replace(/　/g," ");;
    if (text.length == 0) {
        jsonFiltered = [...json.keys()];
        return;
    }
    const filter = [...new Set(text.split(" "))];
    jsonFiltered = json.map((_, i)=>i).filter(i=>{
        var data = JSON.stringify(json[i]);
        if (!capitalState) {
            data = data.toLowerCase();
        }
        if (andOrState == 'and') {
            return !filter.some(f=>!data.includes(f));
        }
        if (andOrState == 'or') {
            return filter.some(f=>data.includes(f));
        }
    });
}

/* ラジオボタン用 HTML を準備 */
function writeRadios () {
    const radiosLabels = ['<i class="bi bi-list-ul me-1"></i>リスト表示', '<i class="bi bi-calendar3 me-1"></i>カレンダー表示'];
    const radios = radiosLabels.map((value, index,)=>(
        '<input type="radio" class="btn-check" name="btnradio" id="btnradio'+index+'" autocomplete="off"'+(index==0?' checked':'')+'>'+
        '<label class="btn btn-outline-secondary" for="btnradio'+index+'" style="width: 120pt">'+value+'</label>'
    )).join('');
    radioState = 0;
    const radiosGroup = '<div class="btn-group" role="group">'+radios+'</div><hr class="my-4">';
    document.getElementById('radiosGroup').innerHTML = radiosGroup;
}

/* ボタンクリックでファイルアップロードのイベントをトリガ */
function handleClickUpload() {
    document.getElementById('formFile').click();
}

/* ファイルアップロード時の処理 */
function handleUploadFile(event) {
    if (event.target.files.length == 0) {
        console.log('no file selected');
        return;
    }
    for (i = 0; i < event.target.files.length; i++) {
        var reader = new FileReader();

        reader.onload = (e)=>{
            var formFile = document.getElementById("formFile");
            try {
                json.push(...JSON.parse(e.target.result));
                setUpJSON();
                formFile.classList.remove('is-invalid');
            } catch (err) {
                console.log('invalid-json');
                formFile.classList.add('is-invalid');
                return;
            }
        };
        reader.readAsText(event.target.files[i]);
    }
    event.target.value = null;
}

/* ボタンクリックでファイルダウンロードのイベントをトリガ */
function handleClickDownload() {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "timetable.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

/* JSON を削除して HTML を非表示化 */
function handleResetJSON () {
    json = jsonFiltered = [];
    writeAllHTML();
    showHTML('fileUpload');
    hideHTML('fileOperate');
    hideHTML('radiosGroup');
    hideHTML('filter');
    hideHTML('list');
    hideHTML('calendar');
}

/* HTML 描画まとめ */
function writeAllHTML () {
    filterJSON();
    writeList();
    writeCalendar();
    writeModals();
}

/* 変数：json が更新されたときの処理まとめ */
function setUpJSON(){
    checkJSON();
    writeAllHTML();
    hideHTML('fileUpload');
    showHTML('fileOperate');
    showHTML('radiosGroup');
    showHTML('filter');
    switch (radioState) {
        case 0: showHTML('list'); break;
        case 1: showHTML('calendar'); break;
        default: break;
    }
}

/* JSON が様式に合うかざっくりチェック */
function checkJSON(){
    var warnMsg = '';
    json.forEach(j=>{
        j.time.forEach(jt=>{
            if (!semesters.includes(jt.semester)) {
                warnMsg += '<i class="bi bi-exclamation-triangle"></i> '+j.subject+': '+jt.semester+' は学期の様式に合いません．<br>';
            }
            if ( jt.period.some(p=>!periods.includes(p)) ) {
                warnMsg += '<i class="bi bi-exclamation-triangle"></i> '+j.subject+': '+jt.period+' は時限の様式に合いません．<br>';
            }
            if (!days.includes(jt.day)) {
                warnMsg += '<i class="bi bi-exclamation-triangle"></i> '+j.subject+': '+jt.day+' は曜日の様式に合いません．<br>';
            }
        })
    });
    document.getElementById('jsonWarn').innerHTML = warnMsg;
    if (warnMsg.length > 0) {
        showHTML('jsonWarn');
    } else {
        hideHTML('jsonWarn');
    }
}

/* JSON からリストを準備 */
function writeList() {
    const listHeaderLabels = [
        {key: 'year',       label: '年度'},
        {key: 'time',       label: '学期・曜日・時限'},
        {key: 'subject',    label: '科目番号'},
        {key: 'lecturers',  label: '担当教員'},
        {key: 'room',       label: '教室'}
    ];
    const listHeader =
        '<thead>' + listHeaderLabels.map((value)=>(
            '<th id="lh_'+value.key+'" scope="col">'+value.label+'</th>'
        )).join('') +
        '</thead>';

    const listBody = '<tbody>'+json.map((js, i)=>(
        jsonFiltered.includes(i) ? ('<tr role="button" data-bs-toggle="modal" data-bs-target="#modal'+i+'">'+
        listHeaderLabels.map((value)=>{
            var ret = '';
            if (value.key == 'time') {
                ret = "（"+js.time.map(t=>Object.values(t).join('・')).join('，')+"）";
            } else if (Array.isArray(js[value.key])) {
                ret = js[value.key].join(', ');
            } else {
                ret = js[value.key];
            }
            return '<td>'+ret+'</td>';
        }).join('')+
        '</tr>'):''
    )).join('')+'</tbody>';
    const timeSortBtn = '<button class="btn btn-outline-secondary me-3" onclick="timeSortJSON()">時系列順</button>'
    const subjectSortBtn = '<button class="btn btn-outline-secondary" onclick="subjectSortJSON()">科目番号順</button>'

    document.getElementById('list').innerHTML = '<div class="mb-3">'+timeSortBtn+subjectSortBtn+'</div>'+
    '<table class="table table-hover print">' + listHeader + listBody + '</table>';
}

/* 時系列ソート */
function timeSortJSON() {
    json.sort((a, b)=>{
        const amin = Math.min([...new Set(a.time.map(r=>r.day))].map(r=>days.indexOf(r)));
        const bmin = Math.min([...new Set(b.time.map(r=>r.day))].map(r=>days.indexOf(r)));
        if (amin > bmin) return 1;
        if (amin == bmin) return 0;
        if (amin < bmin) return -1;
    }).sort((a, b)=>{
        if (a.time.some(r=>r.semester == '前') && !b.time.some(r=>r.semester == '前')) {
            return -1;
        }
        if (!a.time.some(r=>r.semester == '前') && b.time.some(r=>r.semester == '前')) {
            return 1;
        }
        return 0;
    }).sort((a, b)=>{
        if (a.year > b.year) return 1;
        if (a.year == b.year) return 0;
        if (a.year < b.year) return -1;
    });
    setUpJSON();
}
/* 科目番号ソート */
function subjectSortJSON() {
    json.sort((a, b)=>{
        if (a.subject > b.subject) return 1;
        if (a.subject == b.subject) return 0;
        if (a.subject < b.subject) return -1;
    })
    setUpJSON();
}

/* JSON からカレンダーを表示 */
function writeCalendar() {
    const years = [...new Set([...json.filter((_, i)=>jsonFiltered.includes(i))].sort((a, b)=>{
        if (a.year > b.year) return 1;
        if (a. year == b.year) return 0;
        if (a.year < b.year) return -1;
    }).map(r=>r.year))];

    const calBody = years.map(y=>(
        '<div class="mb-5 d-block">'+ // F
        semesters.map((s, i)=>(
            '<div class="break-after">'+ // E
            (i==0?'<div class="print-first">':'')+ // D
            '<h4 class="mb-3">'+y+' 年度'+s+'期</h4>'+
            '<div class="px-0">'+ // C
            '<div class="mb-3 row d-flex justify-content-center">'+ // B
            '<div class="col-1 text-center text-light bg-dark">時限</div>'+
            '<div class="col-11 row">'+days.map(d=>('<div class="col text-center text-light bg-dark">'+d+'</div>')).join('')+'</div>'+
            periods.map(p=>(
                '<div class="col-1 border d-flex align-items-center justify-content-center text-light bg-secondary">'+p+'</div>'+
                '<div class="col-11 row">'+ // A
                days.map(d=>(
                    '<div class="col border p-0">'+
                    [...json.keys()].filter(k=>
                        (jsonFiltered.includes(k) && json[k].year==y && json[k].time.some(jt=>jt.semester==s && jt.day==d && jt.period.includes(p)))
                    ).map(k=>subjectInCal(json[k], k)).join('')+'</div>'
                )).join('')+
                '</div>' // A
            )).join('')+
            '</div>'+ // B
            '</div>'+ // C
            (i==0?'</div>':'')+ // D
            '</div>' // E
        )).join('') +
        '</div>' // F
    )).join('');
    document.getElementById('calendar').innerHTML = calBody;
}

/* JSON 編集画面の設置 */
function writeModals(){
    const modals = json.map((j, i)=>jsonFiltered.includes(i) ? (
        '<div class="modal fade" id="modal'+i+'" tabindex="-1" aria-labelledby="modalH5_'+i+'" aria-hidden="true">'+
        '<div class="modal-dialog modal-dialog-centered">'+
        '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<h5 class="modal-title" id="modalH5_'+i+'"><i class="bi bi-pencil-square"></i> 時間割データ編集</h5>'+
        '<button type="button" class="btn-close" data-bs-dismiss="modal"></button>'+
        '</div>'+
        '<div class="modal-body">'+
        '<textarea class="form-control" rows="20" id="newJson'+i+'">'+JSON.stringify(j, null, '\t')+'</textarea>'+
        '</div>'+
        '<div class="modal-footer justify-content-between">'+
        '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal" onclick="deleteItem('+i+')"><i class="bi bi-trash-fill me-1"></i>削除</button>'+
        '<div><button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal"><i class="bi bi-x me-1"></i>閉じる</button>'+
        '<button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="replaceItem('+i+')"><i class="bi bi-file-earmark-check me-1"></i>一時保存</button></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'
    ):'').join('');
    document.getElementById('modals').innerHTML = modals;
}

/* json から 項目を削除 */
function deleteItem(index) {
    json.splice(index, 1)
    setUpJSON();
}

/* json の項目を差し替え */
function replaceItem(index){
    const newVal = JSON.parse(document.getElementById('newJson'+index).value);
    json[index] = newVal;
    setUpJSON();
}

/* カレンダーの各科目のフォーマット */
function subjectInCal (data, index) {
    return '<div class="card border-0 m-0 mb-3"><div class="card-body p-1">'+
    '<h6 class="card-title">'+data.subject+'</h6>'+
    '<p class="card-text small">'+data.lecturers.join(', ')+'<br>'+
    data.room+' <i class="bi bi-pencil-square text-primary stretched-link" role="button" '+
    'data-bs-toggle="modal" data-bs-target="#modal'+index+'"></i>'+
    '</p>'+
    '</div></div>';
}

/* リスト・カレンダー切替処理 */
function handleRadioChange(event){
    switch(event.target.id) {
        case 'btnradio0':
            hideHTML('calendar');
            showHTML('list');
            radioState = 0;
            break;
        case 'btnradio1':
            hideHTML('list');
            showHTML('calendar');
            radioState = 1;
            break;
        default: console.log('undefined list/calendar radio'); break;
    }
    event.target.blur()
}

/* AND/OR 切替処理 */
function handleAndOrRadioChange (event) {
    andOrState = event.target.value;
    writeAllHTML();
    event.target.blur()
}

/* HTML の表示・非表示切替 */
function showHTML(id) {
    document.getElementById(id).classList.remove('d-none');
}
function hideHTML(id) {
    document.getElementById(id).classList.add('d-none');
}