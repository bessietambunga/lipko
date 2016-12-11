<?php

$dir = 'markup/';

foreach (glob ($dir . "*.html") as $filename)
{
	if( strstr($filename, '-ready.html' ) )
	{
		echo '<a href="'.$filename.'" style="color: #ff0000; font-size: 16px; display: inline-block; margin-bottom: 5px;">'. $filename ."</a><br />";
	}
	else
	{
		echo '<a href="'.$filename.'" style="color: #888888; font-size: 16px; display: inline-block; margin-bottom: 5px;">'. $filename ."</a><br />";	
	}
}