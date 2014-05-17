var width = 700,
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

// レジェンドボックス
var legend_g = d3.select("svg").append("g")
				.attr("transform","translate(" + (width-140) + "," + 0 + ")");
										
						
d3.json("electro_donation_LDP_2007-2011.json", function(data){
	var persons = data["献金者"];		
	var list_length = persons.length; 
	
	x.domain([0,list_length]);
	y.domain([0,45]);
	//　名目値でdomainを作るためにリストの長さを上限にする。
	r.domain([0,list_length]);
	
	
	var gs = svg.append("g")
	.attr("transform","translate(" + width/2 + "," + height/2 + ")")
	.attr("id","main-g")
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
	var year_tooltip = d3.select("#main-g").append("g")
	.append("text")
	.attr("font-size","60px")
	.attr("fill","black")
	.attr("x",0)
	.attr("y",0)
	.attr("text-anchor","middle")
	.attr("opacity",0.5)
	.text("2007");
	
	var description_tooltip = d3.select("#main-g").append("g")
	.append("text")
	.attr("font-size","25px")
	.attr("fill","blue")
	.attr("text-anchor","middle")
	.attr("x",0)
	.attr("y",50)
	.attr("opacity",0.5);
	
	// tspanでテキストを改行する。dyでそれぞれの高さ。xを0にしないとずれる。
	var description_tooltip_tspan1 = description_tooltip.append("tspan")
														.attr("dy","1.2em").attr("x",0);
	var description_tooltip_tspan2 = description_tooltip.append("tspan")
														.attr("dy","1.2em").attr("x",0);;
	// レジェンド枠
	legend_g.append("rect")
		.attr("x",0)
		.attr("y",0)
		.attr("width",140)
		.attr("height",100)
		.attr("fill","white");
	// レジェンドテキスト
	legend_g.append("text").attr("stroke","none").attr("font-size","10px")
			.attr("y",10).text("President");
	legend_g.append("text").attr("stroke","none").attr("font-size","10px")
			.attr("y",35).text("Executive Vice President");
	legend_g.append("text").attr("stroke","none").attr("font-size","10px")
			.attr("y",60).text("Managing Executive Officer");
	legend_g.append("text").attr("stroke","none").attr("font-size","10px")
			.attr("y",85).text("Executive Officer");
	// レジェンドカラーバー
	legend_g.append("rect").attr("x",0).attr("width",80).attr("height",3)
			.attr("y",15).attr("fill",category20("社長"));
	legend_g.append("rect").attr("x",0).attr("width",80).attr("height",3)
			.attr("y",40).attr("fill",category20("副社長"));
	legend_g.append("rect").attr("x",0).attr("width",80).attr("height",5)
			.attr("y",65).attr("fill",category20("常務取締役"));
	legend_g.append("rect").attr("x",0).attr("width",80).attr("height",5)
			.attr("y",90).attr("fill",category20(""));
			
	// 電力会社名を英語に変換する関数。
	function englishCompany(company){
		var engComnapy = "";
		
		switch(company){
		case "東京電力":
			engCompany = "Tokyo Electric Power Co.";
			break;
		case "関西電力":
			engCompany = "Kansai Electric Power Co.";
			break;
		case "中部電力":
			engCompany = "Chubu Electric Power Co.";
			break;
		case "東北電力":
			engCompany = "Tohoku Electric Power Co.";
			break;
		case "北陸電力":
			engCompany = "Hokuriku Electric Power Co.";
			break;
		case "中国電力":
			engCompany = "Chugoku Electric Power Co.";
			break;
		case "四国電力":
			engCompany = "Shikoku Electric Power Co.";
			break;
		case "九州電力":
			engCompany = "Kyushu Electric Power Co.";
			break;
		case "北海道電力":
			engCompany = "Hokkaido Electric Power Co.";
			break;
		}
		return engCompany;
	}
	
	// 献金が0なら0、あるなら10万円を00,000になおす。
	function englishDonation(donation){
		var engDonation = "";
		
		donation == 0 ? engDonation = "0" : engDonation = donation.toString() + "0,000";
		
		return engDonation;
	}
	
	// 役職名を英語にする関数。
	function englishPosition(position){
		var engPosition = "";
		
		switch(position){
		case null:
			engPosition = "No Position";
			break;
		case "常務取締役":
			engPosition = "Managing Executive Officer";
			break;
		case "副社長":
			engPosition = "Executive Vice President";
			break;
		case "取締役":
			engPosition = "Executive Officer";
			break;
		case "社長":
			engPosition = "President";
			break;
		case "会長":
			engPosition = "Chairman";
			break;
		case "顧問":
			engPosition = "Adviser";
			break;
		}
		
		return engPosition;
	}
	
	//　ホバーイベント。イベントはセレクトではなく直接.onで加えないとsvg要素が重なって反映されないときがある。
	rect.on("mouseover",function(){
		//クラスを介して動的に変化する年を取得。
		var this_year = +d3.select(this).attr("class");

		var this_data = d3.select(this).data()[0];
		var fullname = this_data["氏名"];
						
		var position = this_data[this_year]["役職"];
		position = englishPosition(position); // 役職名を英語化。
		
		var donation = this_data[this_year]["献金(万円)"];
		donation = englishDonation(donation); // 万円を0か00,000に変換。
		
		var company = this_data["電力会社"];
		company = englishCompany(company); // 電力会社名を英語に変換。
		
		//description_tooltip.text(company + " " + fullname +  " " + donation + "Yen " + position);
		description_tooltip_tspan1.text(company + " / " + position);
		description_tooltip_tspan2.text(fullname +  " " + donation + "Yen");
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
