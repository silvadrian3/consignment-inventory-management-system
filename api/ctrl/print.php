<html>
    <head>
        <title>Print</title>
        <style media="print">
	    @page, @print {
        	font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
        	size: auto;   /* auto is the initial value */
	    }
	    
	    
	    
	</style>
	
    </head>
    <body onload="printTransactions()" style='font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:12px'>
        <div id="divPrint">
            <?php

                if(isset($_GET['m']) && !empty($_GET['m'])){
                    $k = '0100101001100101011100110111010101110011';
                    $cof = md5($k);
                    $fee = $_GET['m'];

                    if($cof == $fee) {
                        include "con.php";
                        if(!empty($_GET['p'])){ // product barcodes
			$pagename = "Barcodes";
                            foreach($_GET['p'] as $product_id){

                                $query = mysqli_query($nect, "SELECT code, price FROM `products` WHERE id='". $product_id ."'");

                                if($query){
                                    if(mysqli_num_rows($query)!=0){
                                        $fetch = mysqli_fetch_array($query);
                                        echo "<div style='border:solid 0.5px #bbb; text-align:center; padding:0.5%; display:inline-table'>";
                                        echo "P " . $fetch['price'];
                                        echo '<br/><img alt="testing" src="barcode.php?codetype=Code128&text='.$fetch['code'].'&print=false" style="margin:2px" /><br/>';
                                        echo $fetch['code'];
                                        echo "</div>";
                                    }
                                }
                            }
                        }
                        
                        
                        if(!empty($_GET['d'])){ // delivery report
			    $pagename = "Delivery Report";
			    $delivery_id = $_GET['d'];
			    $delivery_id = mysqli_real_escape_string($nect, $delivery_id);

			    $getDeliveryDetails = "SELECT status, date_created, date_posted, total_qty, total_amt, comment FROM `delivery` WHERE id = '".$delivery_id."'";
			
			    $execDeliveryDetails = mysqli_query($nect, $getDeliveryDetails);
			
			    if($execDeliveryDetails){
				while($fetchDeliveryDetails = mysqli_fetch_array($execDeliveryDetails)){
				extract($fetchDeliveryDetails);
				
				if($date_created != "" && $date_created != "0000-00-00"){
					$date_created = date("F d, Y", strtotime($date_created));
				} else {
					$date_created = "";
				}
				
				if($date_posted != "" && $date_posted != "0000-00-00"){
					$date_posted = date("F d, Y", strtotime($date_posted));
				} else {
					$date_posted = "";
				}
				
				if($comment == ''){
					$comment = 'N/A';
				}
				
				echo "<div style='padding:20px 0'>";
				echo "<p>Delivery ID: $delivery_id</p>";
				echo "<p>Date Created: $date_created</p>";
				echo "<p>Delivery Status: $status</p>";
				echo "<p>Date Posted: $date_posted</p>";
				echo "</div>";
				}
			
			    }
			    
			    $getDeliveryBreakdown = "SELECT a.name, a.code, b.description, b.price, b.quantity, b.total FROM `products` as a INNER JOIN `delivery_breakdown` as b ON (a.id = b.product_id) WHERE b.delivery_id = '".$delivery_id."'";
			    
			    $execDeliveryBreakdown = mysqli_query($nect, $getDeliveryBreakdown);
			    
			    if($execDeliveryBreakdown){
			    	echo "<table style='border: solid 1px #333; width:100%;font-size:12px ' cellpadding=0 cellspacing=0>";
			    	echo "<thead>";
			    	echo "<tr>";

			    	echo "<th style='border: solid 1px #333; width:30%; padding: 2px 5px'>Product Name</th>";
			    	echo "<th style='border: solid 1px #333; width:20%; padding: 2px 5px'>Code</th>";
			    	echo "<th style='border: solid 1px #333; width:20%; padding: 2px 5px'>Unit Price</th>";
			    	echo "<th style='border: solid 1px #333; width:10%; padding: 2px 5px'>Qty</th>";
			    	echo "<th style='border: solid 1px #333; width:20%; padding: 2px 5px'>Amount</th>";

			    	echo "</tr>";
			    	echo "<thead>";
			    	
			    	echo "<tbody>";
			    		$x = 0;
				    while($fetchDeliveryBreakdown = mysqli_fetch_array($execDeliveryBreakdown)){
					extract($fetchDeliveryBreakdown);
					$rowcolor = '';
					if($x%2 == 0){
						$rowcolor = 'background-color:#f0f0f0';
					}
					echo "<tr style='$rowcolor'>";
					echo "<td style='border: solid 1px #333; text-align:left; padding: 1px 5px'>$name</td>";
				    	echo "<td style='border: solid 1px #333; text-align:center; padding: 1px 5px'>$code</td>";
				    	echo "<td style='border: solid 1px #333; text-align:right; padding: 1px 5px'>P ". number_format($price, 2) ."</td>";
				    	echo "<td style='border: solid 1px #333; text-align:center; padding: 1px 5px'>$quantity</td>";
				    	echo "<td style='border: solid 1px #333; text-align:right; padding: 1px 5px'>P ". number_format($total, 2) ."</td>";
					echo "</tr>";
					
					$x++;
					}
					
				echo "</tbody>";
				echo "</table>";
			    }
			    echo "<div style='padding:20px 0'>";
			    echo "<p>Total Qty: $total_qty</p>";
			    echo "<p>Total Amount: P ". number_format($total_amt, 2) ."</p>";
			    echo "<p> Comments:<br/>$comment</p>";
			    echo "</div>";
			    
                        }                        
                    }
                }

            ?>
        </div>
    	<script type="text/javascript">
	    function printTransactions() {
	        var divToPrint=document.getElementById("divPrint");
	        document.title='<?php echo $pagename ?>';
	        window.print();
	        window.close();
	    }
	</script>
    </body>
</html>

            
