var width = 760,
height = 600;

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);

// 0~360にスケールすることで、円周に合わせる。
var radius = height/3;
var timeline = [2007,2008,2009,2010,2011];
var timeline_length = timeline.length;
var tick_count = 1;
var duration = 2200;

var r = d3.scale.linear()
		.range([0,360]);

var x = d3.scale.linear()
    .range([0, width/2]);

var y = d3.scale.linear()
    .range([radius, 0]);
		
var category20 = d3.scale.category20();
var category10 = d3.scale.category10();

var line = d3.svg.line()
.x(0)
.y(function(d) { return y(d); });
	

d3.json("electro_donation_LDP_2007-2011.json", function(data){

	var persons = data["献金者"];		
	var list_length = persons.length; 
	
  x.domain([0,list_length]);
	y.domain([0,40]);
	//　名目値でdomainを作るためにリストの長さを上限にする。
	r.domain([0,list_length]);
	
	
	var gs = svg.attr("transform","translate(" + width/2 + "," + height/2 + ")")
.selectAll("g")
	.data(persons) // Use pie to get radian adjuted whole of the data.
	.enter()
	.append("g").attr("transform",function(d,i){ return "rotate(" + r(i) + ")"; });
	//r(i)でインデックスごとに回転スケールすることで、名目値を円周にマッピングできる。
					
	var line_path = gs.append("path")
	.attr("d",function(d){ return line([0,parseInt(d[2007]["献金(万円)"])]);})
	.attr("stroke", function(d){ return category20(d[2007]["役職"]); })
	.attr("stroke-width",5)
	.attr("stroke-linecap","round");
		
	var text = gs.append("text")
	.attr("x",0)
	.text(function(d){ return d["氏名"]; })
	.attr("font-size","10px")
	.attr("fill", "black")
	.attr("opacity",0.9)
	.attr("transform",function(d,i){
		// 円の右と左でテキストの方向を変える。
		if(i >= list_length/2) {
			return "rotate(270 " + 0 + "," + radius +")"
		} else{				
			return "rotate(-90 " + 0 + "," + radius +")"
		} 
	});
	// 回転角度の90度にテキストを向けるには、rotate(角度, x,y)でtranslateも同時に設定しないと回転が反映されない。
	
	var rect = gs.append("rect")
	.attr("class",2007)
	.attr("x",0)
	.attr("y", 0)
	.attr("height",height)
	.attr("width",10)
	.attr("fill", function(d){ return category10(d["電力会社"])})
	.attr("opacity",0.2);
	
	//ツールチップはsvg.からではなく、d3.selectからやらないと反映されない。
	var year_tooltip = d3.select("svg").append("g")
	.append("text")
	.attr("font-size","60px")
	.attr("fill","black")
	.attr("x",0)
	.attr("y",0)
	.attr("text-anchor","middle")
	.attr("opacity",0.5)
	.text("2007");
	
	var description_tooltip = d3.select("svg").append("g")
	.append("text")
	.attr("font-size","25px")
	.attr("fill","blue")
	.attr("text-anchor","middle")
	.attr("x",0)
	.attr("y",50)
	.attr("opacity",0.5);
	
	
	//　ホバーイベント。イベントはセレクトではなく直接.onで加えないとsvg要素が重なって反映されないときがある。
	rect.on("mouseover",function(){
		//クラスを介して動的に変化する年を取得。
		var this_year = +d3.select(this).attr("class");

		var this_data = d3.select(this).data()[0];
		var fullname = this_data["氏名"];
		var company = this_data["電力会社"];
		var position = this_data[this_year]["役職"];
		var donation = this_data[this_year]["献金(万円)"];
		
		description_tooltip.text(company + " " + fullname +  " " + donation + "万円 " + position);
	});
	
	
	// tick animation ---------------- 
	
	setInterval(function(){
		tick();
	},duration+700);

	
	function tick(){
		var year_index = tick_count % timeline_length;
		var target_year = timeline[year_index];
		
		renderChart(target_year);
		tick_count += 1;
	};
	
	function renderChart(year){
		
		line_path.transition()
		.duration(duration)
		.attr("d",function(d){ return line([0,parseInt(d[year]["献金(万円)"])]);})
		.attr("stroke", function(d){ return category20(d[year]["役職"]); });
		//　クラス名を現在の年に変えることで、ツールチップの表示を変えるキーにする。
		rect.attr("class",year);
		
		var year_tooltip_text = year_tooltip.transition()
		.duration(20)
		.text(year);
	
	};

})
