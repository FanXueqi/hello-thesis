<?php
  if (isset($_GET["case"])) {
    $case = $_GET["case"];
    $result= load_case_data($case);
    header("Content-type: application/json");
    print(json_encode($result));
  } else if (isset($_GET["classification"])) {
    $classification = $_GET["classification"];
    $result = load_classification_data($classification);
    header("Content-type: application/json");
    print(json_encode($result));
  } else {
    output_error("Baby you need to pass a parameter!");
  }

  function load_case_data($case) {
    $result = array();
    $file_name = "cases/" . $case . "/info.txt";
    $infoContent = file($file_name, FILE_IGNORE_NEW_LINES);
    foreach ($infoContent as $line) {
      list($part1,$part2) = explode(':', $line, 2);
      if (strpos($part2, '|') !== false) {
        $part2 = explode('|', $part2);
      }
      $result[$part1] = $part2;
    }
    $images = glob("cases/"  . $case . "/imgs/*");
    $result["ImgSrcs"] = $images;
    return $result;
  }

  function load_classification_data($classification) {
    $result = array();
    $file_name = "classification/".$classification."/classes.txt";
    $classes = file($file_name, FILE_IGNORE_NEW_LINES);
    foreach ($classes as $class) {
      list($part1, $part2) = explode(':', $class);
      if ($part2 != "") {
        $cases = explode(',', $part2);
        $result[$part1] = $cases;
      } else {
        $result[$part1] = [];
      }
    }
    return $result;
  }


  function output_error($msg) {
    header("HTTP/1.1 400 Invalid Request");
    header("Content-type: text/plain");
    /* Otherwise we have an error, and should say so. */
    echo $msg;
  }
?>
