var json;

window.onload = function () {
    var h1 =
        '<h1 class="text-secondary mb-4">JSON 時間割</h1>';
    var file =
        '<div class="mb-4">'+
        '<label for="formFile" class="form-label">時間割用 JSON ファイルを選択</label>'+
        '<input class="form-control" type="file" id="formFile">'+
        '<div class="invalid-feedback">JSON ファイルを選択してください．</div>'+
        '</div>';
    var radios = ['リスト表示', 'カレンダー表示'].map((value, index,)=>(
        '<input type="radio" class="btn-check" name="btnradio" id="btnradio'+index+'" autocomplete="off"'+(index==0?' checked':'')+'>'+
        '<label class="btn btn-outline-secondary" for="btnradio'+index+'">'+value+'</label>'
    )).join('');
    var radioGroup = '<div class="btn-group mb-4" role="group">'+radios+'</div>';

    var html = h1 + file + radioGroup;
    var body = document.getElementById('control');
    body.innerHTML = html;

    function onChange(event){
        var reader = new FileReader();
        reader.onload = (e)=>{
            try {
                json = JSON.parse(e.target.result);
                console.log(json);
                document.getElementById("formFile").classList.remove('is-invalid');
            } catch (err) {
                console.log('not json');
                document.getElementById("formFile").classList.add('is-invalid');
                return;
            }
        };
        reader.readAsText(event.target.files[0]);
    }

    document.getElementById("formFile").addEventListener("change", onChange);
}