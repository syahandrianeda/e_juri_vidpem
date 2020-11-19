var modal = document.getElementById('id01'); // Get the modal
var mySidebar = document.getElementById("mySidebar"); // Get the Sidebar
var overlayBg = document.getElementById("myOverlay"); // Get the DIV with overlay effect
var script_gs = "https://script.google.com/macros/s/AKfycby9g8JcOtMML7krnWiWDj1GfgxcwXj6k3v0TOCqL_dHQPRKg-E/exec";


function w3_open() { // Toggle between showing and hiding the sidebar, and add overlay effect
    if (mySidebar.style.display === 'block') {
        mySidebar.style.display = 'none';
        overlayBg.style.display = "none";
    } else {
        mySidebar.style.display = 'block';
        overlayBg.style.display = "block";
    }
}

function w3_close() { // Close the sidebar with the close button
    mySidebar.style.display = "none";
    overlayBg.style.display = "none";
}
$(document).ready(function () {
    document.getElementById("modallogin").style.display = "block";
})

function gurulogin(){
    document.getElementById("modallogin").style.display = "none";
    document.getElementById("mainlogin").style.display = "none";
    document.getElementById("mainjuri").style.display = "block";
    // variable umum:var teksnamaguru = document.frmlogin.namaguru.value
    var valuelogin = document.frmlogin.namaguru.value;
    var jenjangjuri = valuelogin.split("|")[1];// result: TK atau SD atau SMP
    var namajuri = valuelogin.split("|")[0];
    
    // mengubah identitas juri di teks pembuka
    document.getElementById("namajuritelahlogin").innerHTML = namajuri;
    document.getElementById("jenjangtelahlogin").innerHTML =jenjangjuri;
    //mengubah identitas di sidebar
    document.getElementById("namasekolah").innerHTML = namajuri;
    document.getElementById("namakota").innerHTML = "Jenjang "+jenjangjuri;
    //sembunyikan barlogin dan tampilkan barlogout
    document.getElementById("barlogin").style.display = "none"
    document.getElementById("barlogout").style.display = "block"
    //ketika variabel jenjangjuri dipilih, maka laman memanggil json dari data Excel Google Drive;
    daftarpeserta(jenjangjuri)


}
function daftarpeserta(jenjang){
var URL= script_gs + "?action=tabel" +jenjang;
/// tabel untuk juri
var divtabel = document.getElementById("tabelpendaftar");
var tabelpeserta = document.createElement("table");
tabelpeserta.setAttribute("id","tabelpesarta");
tabelpeserta.setAttribute("class","versi-table");
tabelpeserta.setAttribute("style", "border-collapse:collapse;border:1px solid black");
var tr = tabelpeserta.insertRow(-1);
var th1 = document.createElement("th");
th1.innerHTML = "No";
var th2 = document.createElement("th");
th2.innerHTML = "Nama Peserta";
var th3 = document.createElement("th");
th3.innerHTML = "Instansi";
var th4 = document.createElement("th");
th4.innerHTML = "No. WA";
var th5 = document.createElement("th");
th5.setAttribute("style","background-color:yellow");
th5.innerHTML = "Beri Nilai";

tr.appendChild(th1);
tr.appendChild(th2);
tr.appendChild(th3);
tr.appendChild(th4);
tr.appendChild(th5);
document.getElementById("loading").innerHTML="<i class='fa fa-spin fa-spinner' style='font-size:36px'></i> Prosess ..."
$.getJSON(URL,function(json){
    for(var a = 0; a < json.records.length ; a++){
        var tr2 = tabelpeserta.insertRow(-1);
        var cell = tr2.insertCell(-1);
        cell.innerHTML = a + 1;
        var cell = tr2.insertCell(-1);
        cell.innerHTML = json.records[a].namapeserta;
        var cell = tr2.insertCell(-1);
        cell.innerHTML = json.records[a].instansi;
        var cell = tr2.insertCell(-1);//hp
        var tombolwa = document.createElement("button");
        tombolwa.setAttribute("onclick","kirimwa("+json.records[a].nowa+")");
        tombolwa.innerHTML = json.records[a].nohp
        //cell.innerHTML = "-";
        cell.appendChild(tombolwa);
        var cell = tr2.insertCell(-1);
        cell.innerHTML = "Klik Refresh Data";
        
        
        
    }
    document.getElementById("loading").innerHTML="";
    var tomboldata = document.createElement("button");
    tomboldata.setAttribute("onclick","perlihatkannilai('"+jenjang+"')")
    tomboldata.innerHTML="Refresh Data";
    document.getElementById("loading").appendChild(tomboldata);


})
//taruh di div tabelpendaftar
divtabel.innerHTML="";
divtabel.appendChild(tabelpeserta)


}

function perlihatkannilai(jenjang){
    var baristabeldata = document.getElementById("tabelpesarta").rows;
    var url = script_gs+"?action=ceknilai";
    $.getJSON(url, function(json){
        for (i=1;i<baristabeldata.length;i++){
            for(a=0;a<json.records.length;a++){
        //baristabeldata[i].cells[4].innerHTML = "";
            //if(baristabeldata[i].celss[1].innerHTML == json.records[a].namapeserta && baristabeldata[i].celss[2].innerHTML == json.records[a].instansi){
            if(baristabeldata[i].cells[1].innerHTML == json.records[a].namapeserta && baristabeldata[i].cells[2].innerHTML == json.records[a].instansi){
            baristabeldata[i].cells[4].setAttribute("style","background-color:yellow");
            baristabeldata[i].cells[4].innerHTML = json.records[a].total;
            break;
            
            }
            else{
                var tombolnilai = document.createElement("button");
                tombolnilai.setAttribute("onclick","berinilai('"+i+"|"+jenjang+"')")
                tombolnilai.innerHTML = "Beri Skor";

                baristabeldata[i].cells[4].innerHTML = "";
                baristabeldata[i].cells[4].append(tombolnilai);
           }
        }
    }
    })


}
function berinilai(variabelnya){
    var baris = variabelnya.split("|")[0];
    var jenjangx = variabelnya.split("|")[1];

    var barisasli = baris * 1 + 1;
    var barisjson = baris * 1 - 1;;
    var url = script_gs+"?action=tabel"+jenjangx;
    //alert("nilai baris =" + baris +", jenjang=" + jenjangx +", baris asli ss ="+barisasli)
    //panggil modal petunjuk
    document.getElementById("modalpetunjuk").style.display="block";
    document.getElementById("judulpetunjuk").innerHTML = "<i class='fa fa-spin fa-spinner' style='font-size:36px'></i> Prosess ...";
    document.getElementById("isipetunjuk").innerHTML="<hr style='border-bottom:5px double red'/>"//"<br/><br/><br/>Script by Ade Andriansyah<br/><br/><br/>"
    $.getJSON(url,function(json){
        var tabel = document.createElement("table");
        tabel.setAttribute("class","versi-table")
        
      
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Tanggal Kirim"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = new Date(json.records[barisjson].tanggalkirim).toLocaleString();
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Nama Peserta"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = json.records[barisjson].namapeserta;  
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Instansi"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = json.records[barisjson].instansi;
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "NIP"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = json.records[barisjson].nip;
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Alamat Instansi"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = json.records[barisjson].alamatinstansi;
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Kirim Pesan WA"
        var cell2 = brs.insertCell(1);
        var tombolwa = document.createElement("button");
        tombolwa.setAttribute("onclick","kirimwa("+json.records[barisjson].nowa+")");
        tombolwa.innerHTML = json.records[a].nohp
        //cell.innerHTML = "-";
        cell2.appendChild(tombolwa);
        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Url Video"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = "<a href='"+json.records[barisjson].linkvideo+"' target='_blank'>"+json.records[barisjson].linkvideo+"</a>";
        
        var jsonlink = json.records[barisjson].linkvideo
        var linkoke = jsonlink.indexOf("https://drive.google.com/file/d/");
        var linkfolder = jsonlink.indexOf("https://drive.google.com/drive/u/2/folders");//https://drive.google.com/drive/u/2/folders/14p6rd25l7_SUg5BNA9JGjYhWb2mfufdg;
        var linkyoutub = jsonlink.indexOf("https://youtu.be/");
        //var linktolak = //https://drive.google.com/file/d/1aZO4YfzCd3Rp-YiifWbhTmfJMjX5pdMb/view?usp=sharing
        var tekssel;
        if(linkoke > -1){
            tekssel = "Video Siap Dinilai, jika tidak tampil hak akses dari pengirim masih berstatus DIBATASI"
        }else if(linkfolder > -1){
            tekssel ="link video masih dalam folder atau hak akses dari pengirim belum diberikan"
        }else if(linkyoutub>-1){
            tekssel ="Video telah diunggah di Youtube"
        }else{
            tekssel="Link Video Tidak dikenal"
        }

        var brs = tabel.insertRow(-1);
        var cell1 = brs.insertCell(0);
        cell1.innerHTML = "Kesiapan Video"
        var cell2 = brs.insertCell(1);
        cell2.innerHTML = tekssel;

        //<iframe src="https://drive.google.com/file/d/1gyIU2BJDQMnc5JBRFDgs4NyVmuDH5Eme/preview" width="640" height="480"></iframe>
        document.getElementById("isipetunjuk").append(tabel);
        var batas = document.createElement("hr")

        batas.setAttribute("style","border-bottom:5px solid blue");
        document.getElementById("isipetunjuk").append(batas);
        
        if(linkoke > -1){
        var linkpreview1 = jsonlink.replace("view","preview");
        var linkpreview = linkpreview1.replace("?usp=sharing","");
//https://drive.google.com/file/d/1gyIU2BJDQMnc5JBRFDgs4NyVmuDH5Eme/view?usp=sharing

        var videop = document.createElement("iframe");
        videop.setAttribute("width","94%");
        //videop.setAttribute("height","480");
        videop.setAttribute("src",linkpreview)
        document.getElementById("isipetunjuk").append(videop);
        }
        else{

        }


        document.getElementById("judulpetunjuk").innerHTML = "Form Penjurian Video Pembelajaran"
    })
}
function getLinkWhastapp(number, message) {
    var url = 'https://api.whatsapp.com/send?phone='      + number        + '&text='        + encodeURIComponent(message);  
    return url
  }
function kirimwa(nohp){
    alert("ini pesan nowa " + nohp)
    var teksnya = "e-Juri pesan:  ";
        var urlnya = getLinkWhastapp(nohp, teksnya);
    location.replace(urlnya);
}
function loginelamaso(){
    document.getElementById("modallogin").style.display = "block";
    w3_close();
}
function logoutelamaso(){
    document.getElementById("mainlogin").style.display = "block";
    document.getElementById("mainjuri").style.display = "none";
    w3_close();
    //sembunyikan barlogin dan tampilkan barlogout
    document.getElementById("barlogin").style.display = "block";
    document.getElementById("barlogout").style.display = "none";
   
}
