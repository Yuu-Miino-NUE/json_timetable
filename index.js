/* グローバル変数 */
var json = [];
const semesters = ['前', '後'];
const days = ['月', '火', '水', '木', '金'];
const periods = [1, 2, 3, 4, 5];

/* ウィンドウ読み込み時の処理 */
window.onload = function () {
    /* HTML 文字列設定 */
    const fileInput =
        '<div class="mb-4">'+
        '<input class="form-control" type="file" id="formFile" accept=".json" hidden multiple>'+
        '<button class="btn btn-primary" style="width: 120pt" id="btnUploadFile" onclick="handleClickUpload()">'+
        '<i class="bi bi-file-earmark-arrow-up"></i> アップロード</button>'+
        '<div class="invalid-feedback pt-2">ファイル読み込みに失敗しました．フォーマットを確認してください．</div>'+
        '<div class="text-warning py-3" id="jsonWarn"></div>'
        '</div>';

    const radiosLabels = ['<i class="bi bi-list-ul"></i> リスト表示', '<i class="bi bi-calendar3"></i> カレンダー表示'];
    const radios = radiosLabels.map((value, index,)=>(
        '<input type="radio" class="btn-check" name="btnradio" id="btnradio'+index+'" autocomplete="off"'+(index==0?' checked':'')+'>'+
        '<label class="btn btn-outline-secondary" for="btnradio'+index+'" style="width: 120pt">'+value+'</label>'
    )).join('');
    const radioGroup = '<div class="btn-group mb-4 d-none" id="radioGroup" role="group">'+radios+'</div>';

    var html = fileInput + radioGroup;

    /* DOM を使用して HTML を書き換え */
    document.getElementById('control').innerHTML = html;

    /* DOM にイベントリスナを設定 */
    document.getElementById("formFile").addEventListener("change", handleUploadFile);
    document.querySelectorAll("input[name='btnradio']").forEach((dom)=>(
        dom.addEventListener('change', handleRadioChange)
    ));
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
                document.getElementById("radioGroup").classList.remove("d-none");
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

/* 変数：json が更新されたときの処理まとめ */
function setUpJSON(){
    checkJSON();
    jsonList();
    jsonCalendar();
    makeModals();
}

/* JSON が様式に合うかざっくりチェック */
function checkJSON(){
    var warnMsg = '';
    json.forEach(j=>{
        j.time.forEach(jt=>{
            console.log(jt)
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
}

/* JSON からリストを表示 */
function jsonList() {
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
        '<tr role="button" data-bs-toggle="modal" data-bs-target="#modal'+i+'">'+
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
        '</tr>'
    )).join('')+'</tbody>';

    document.getElementById('list').innerHTML = '<table class="table table-hover">' + listHeader + listBody + '</table>';
}

/* JSON からカレンダーを表示 */
function jsonCalendar() {
    const years = [...new Set([...json].sort((a, b)=>{
        if (a.year > b.year) return 1;
        if (a. year == b.year) return 0;
        if (a.year < b.year) return -1;
    }).map(r=>r.year))];

    const calBody = years.map(y=>(
        '<div class="mb-5"><h2 class="mb-3">'+y+' 年度</h2>'+
        semesters.map(s=>(
            '<h4 class="mb-3">'+s+'期</h4>'+'<div class="px-0"><div class="mb-3 row d-flex justify-content-center">'+
            '<div class="col-1 text-center text-light bg-dark">時限</div>'+
            '<div class="col-11 row">'+days.map(d=>('<div class="col text-center text-light bg-dark">'+d+'</div>')).join('')+'</div>'+
            periods.map(p=>(
                '<div class="col-1 border d-flex align-items-center justify-content-center text-light bg-secondary">'+p+'</div>'+
                '<div class="col-11 row">'+
                days.map(d=>(
                    '<div class="col border p-2">'+
                    [...json.keys()].filter(k=>
                        (json[k].year==y && json[k].time.some(jt=>jt.semester==s && jt.day==d && jt.period.includes(p)))
                    ).map(k=>subjectInCal(json[k], k)).join('')+'</div>'
                )).join('')+'</div>' // col-11
            )).join('')+'</div>' // col-11
        )).join('')+'</div></div>' // row, container
    )).join('');

    document.getElementById('calendar').innerHTML = calBody;
}

/* JSON 編集画面の設置 */
function makeModals(){
    const modals = json.map((j, i)=>(
        '<div class="modal fade" id="modal'+i+'" tabindex="-1" aria-labelledby="modalH5_'+i+'" aria-hidden="true">'+
        '<div class="modal-dialog">'+
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
    )).join('');
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
    return '<div class="card border-0 mb-3"><div class="card-body p-0">'+
    '<h6 class="card-title">'+data.subject+'</h6>'+
    '<p class="card-text small">'+data.lecturers.join(', ')+'<br>'+
    data.room+' <i class="bi bi-pencil-square text-primary stretched-link" role="button" '+
    'data-bs-toggle="modal" data-bs-target="#modal'+index+'"></i>'+
    '</p>'+
    '</div></div>';
}

/* ラジオボタン切替処理 */
function handleRadioChange(event){
    switch(event.target.id) {
        case 'btnradio0':
            showHTML('calendar', false);
            showHTML('list', true);
            break;
        case 'btnradio1':
            showHTML('list', false);
            showHTML('calendar', true);
            break;
        default: console.log('undefined radio'); break;
    }
    event.target.blur()
}

/* HTML の表示・非表示切替 */
function showHTML(id, show) {
    const classes = document.getElementById(id).classList;
    if (!show) {
        classes.add('d-none');
    } else {
        classes.remove('d-none');
    }
}