function getScriptFolder() {
  var extPath = new File($.fileName).parent.parent.fsName;
  var folder = new Folder(extPath + "/scripts");
  if (!folder.exists) folder.create();
  return folder;
}

function saveScript(name, code) {
  var file = new File(getScriptFolder().fsName + "/" + name + ".jsx");
  file.encoding = "UTF-8";
  file.open("w");
  file.write(code);
  file.close();
  return true;
}

function loadScriptList() {
  var folder = getScriptFolder();
  var files = folder.getFiles("*.jsx");
  var list = [];

  for (var i = 0; i < files.length; i++) {
    list.push({
      name: decodeURIComponent(files[i].name.replace(".jsx", "")),
      type: "ExtendScript",
      autorun: false // opcional: podrías leer esto de un archivo JSON
    });
  }
  return JSON.stringify(list);
}

function runScript(name) {
  var path = getScriptFolder().fsName + "/" + name + ".jsx";
  var file = new File(path);
  if (file.exists) {
    $.evalFile(file);
    return true;
  }
  return false;
}

function deleteScript(name) {
  var file = new File(getScriptFolder().fsName + "/" + name + ".jsx");
  if (file.exists) {
    return file.remove();
  }
  return false;
}
