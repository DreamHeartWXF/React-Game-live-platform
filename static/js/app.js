// 通过闭包定义一个模块
'use strict';

(function ($, React, ReactRouter, Reflux) {
	// 定义一些初始化数据
	var ITEM_NUM = 48; // item背景图片
	var app = $('#app'); // 容器元素
	var DataBase = null; // 存储的数据对象

	//  创建分类的消息对象
	var TypeAction = Reflux.createActions(['changeType']);
	//  创建store，存储数据
	var TypeStore = Reflux.createStore({
		// 绑定消息对象的
		listenables: [TypeAction],
		// 定义TypeAction中每一个消息的回调函数
		onChangeType: function onChangeType(query) {
			// 过滤DataBase中的数据，找去type是query的数据
			var result = [];
			DataBase.forEach(function (obj) {
				// obj的type要等于query
				if (obj.type === query) {
					// 存储数据
					result.push(obj);
				}
			});
			// 在这里通过this.trigger更新数据
			this.trigger(result);
		}
	});

	//  定义搜索aciton对象
	var SearchAction = Reflux.createActions(['changeSearch']);
	//  定义搜索store对象
	var SearchStore = Reflux.createStore({
		listenables: [SearchAction],
		onChangeSearch: function onChangeSearch(query) {
			// 根据query过滤数据
			var result = [];
			DataBase.forEach(function (obj) {
				// 判断每一个属性是否包含query
				for (var i in obj) {
					// 属性值是否包含query
					if (obj[i].indexOf(query) >= 0) {
						// 存储
						result.push(obj);
						// 不需要再次遍历
						return;
					}
				}
			});
			// 更新数据
			this.trigger(result);
		}
	});
	// 定义方法，创建list
	var Methods = {
		// 创建渲染dom方法
		makeBlock: function makeBlock() {
			return this.props.navData.typeList.map((function (value, index) {
				// 处理数据
				var arr = [];
				this.props.navData.list.forEach(function (obj, index) {
					if (obj.type.indexOf(value) >= 0) {
						arr.push(obj);
					}
				});
				return React.createElement(
					'div',
					{ className: 'nav-sort', key: index },
					React.createElement(
						'p',
						null,
						value
					),
					React.createElement(
						'ul',
						{ ref: 'ul' },
						this.makeList(arr)
					)
				);
			}).bind(this));
		},
		makeList: function makeList(arr) {
			return arr.map(function (obj, index) {
				return React.createElement(
					'li',
					{ key: index },
					React.createElement(
						'a',
						{ href: obj.site },
						obj.name
					)
				);
			});
		},
		createHome: function createHome() {
			return this.state.data.list.map(function (obj, index) {
				return React.createElement(
					'li',
					{ key: index },
					React.createElement(
						'a',
						{ href: obj.site },
						React.createElement('img', { src: obj.img, alt: '' })
					),
					React.createElement(
						'p',
						null,
						obj.name
					)
				);
			});
		}
	};
	// 导航组件
	var Nav = React.createClass({
		displayName: 'Nav',

		// 继承混合方法
		mixins: [Methods],
		// 初始化状态数据
		getInitialState: function getInitialState() {
			return {
				data: []
			};
		},
		// 点击回车进入搜索页面
		goToSearch: function goToSearch(e) {
			// console.log(123)
			// 如果是回车键（13）
			if (e.keyCode === 13) {
				console.log(e.target);
				// 输入校验
				// 去除首尾空白
				var value = e.target.value.replace(/^\s+|\s+$/g, '');
				// 必须有内容，
				if (/^\s*$/.test(value)) {
					alert('请您输入内容！');
					return;
				}
				// 要对输入的内容，编码
				// value = encodeURIComponent(value);
				// 进入搜索页面
				// ReactRouter.HashLocation.replace('/search/' + value)
				// 发送消息

				// 清空输入框内容
				e.target.value = '';
			}
		},
		goSearch: function goSearch() {
			console.log(123456789);
		},
		render: function render() {
			return React.createElement(
				'div',
				{ className: 'left', ref: 'left' },
				React.createElement(
					'div',
					{ className: 'logo-input' },
					React.createElement(
						'div',
						{ className: 'logo' },
						React.createElement(
							'a',
							{ href: '#/home' },
							React.createElement('img', { src: 'img/list/logo.png', alt: '' })
						)
					),
					React.createElement(
						'div',
						{ className: 'search' },
						React.createElement('input', { type: 'text', placeholder: '搜索游戏/主播', onKeyDown: this.goToSearch }),
						React.createElement('a', { onClick: this.goSearch })
					)
				),
				React.createElement(
					'ul',
					{ className: 'sort' },
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ href: '' },
							'全部'
						)
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ href: '' },
							'分类'
						)
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ href: '' },
							'主播地图'
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'navAll', ref: 'navAll' },
					React.createElement(
						'p',
						{ className: 'oneMore', ref: 'oneMore' },
						'一屏多看',
						React.createElement(
							'span',
							{ className: 'beta' },
							React.createElement(
								'i',
								null,
								'beta'
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'navList', ref: 'navList' },
						this.makeBlock()
					),
					React.createElement(
						'div',
						{ className: 'more' },
						React.createElement(
							'span',
							null,
							'直播指导'
						),
						React.createElement(
							'span',
							null,
							'客服支持'
						),
						React.createElement(
							'span',
							null,
							'问题反馈'
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'user' },
					React.createElement(
						'span',
						{ className: 'login' },
						'登录'
					),
					React.createElement(
						'span',
						{ className: 'rigest' },
						'注册'
					)
				),
				React.createElement('em', { className: 'btn-goleft', ref: 'goLeft' })
			);
		},
		// 在组件更新完成阶段绑定事件
		componentDidMount: function componentDidMount() {
			var nav = $(this.refs.left.getDOMNode());
			var a = 0;
			// 保存this
			var me = this;
			// 给元素绑定事件
			// 实现滚动条样式
			$(me.refs.navList.getDOMNode()).width($(me.refs.navAll.getDOMNode()).width());
			$(me.refs.oneMore.getDOMNode()).width($(me.refs.navAll.getDOMNode()).width());
			// 实现导航栏动画
			$(me.refs.goLeft.getDOMNode()).click(function (e) {

				if (!a) {
					HomeAction1.getSignal(a);
					a = 1;
					$(e.target).css("background-position", "-134px 0");
					$(e.target).hover(function () {
						$(this).css("background-position", "-149px 0");
					}, function () {
						$(this).css("background-position", "-134px 0");
					});
					// 执行动画
					$(nav).animate({ left: "-230px" }, 200);
				} else {
					HomeAction1.getSignal(a);
					a = 0;
					$(e.target).css("background-position", "-164px 0");
					$(e.target).hover(function () {
						$(this).css("background-position", "-179px 0");
					}, function () {
						$(this).css("background-position", "-164px 0");
					});
					// 改变navleft
					$(nav).animate({ left: "0px" }, 200);
				}
			});
		}
	});

	// 创建action
	var HomeAction = Reflux.createActions(["changeType", "getSignal"]);
	var HomeAction1 = Reflux.createActions(["getSignal"]);
	var HomeStore = Reflux.createStore({
		// 监听
		listenables: [HomeAction],
		// 监听事件
		onChangeType: function onChangeType(query) {
			// 根据query过滤数据
			var arr = {
				list: []
			};
			DataBase.list.forEach(function (obj) {
				if (obj.type.indexOf(query) >= 0) {
					arr.list.push(obj);
				}
			});
			this.trigger(arr);
		},
		onGetSignal: function onGetSignal(signal) {
			this.trigger(signal);
		}
	});
	var HomeStore1 = Reflux.createStore({
		// 监听
		listenables: [HomeAction1],
		onGetSignal: function onGetSignal(signal) {
			this.trigger(signal);
		}
	});
	// 首页组件
	var Home = React.createClass({
		displayName: 'Home',

		// 继承方法
		mixins: [Reflux.connect(HomeStore, "data"), Reflux.connect(HomeStore1, "signal"), Methods],
		// 初始化状态数据
		getInitialState: function getInitialState() {
			return {
				signal: 5,
				data: this.props.navData
			};
		},
		render: function render() {
			return React.createElement(
				'div',
				{ className: 'home', ref: 'home' },
				React.createElement(
					'div',
					{ className: 'main clearfix' },
					React.createElement(
						'div',
						{ className: 'nav-top' },
						React.createElement(
							'h1',
							null,
							'全部分类'
						),
						React.createElement(
							'ul',
							{ className: 'home-nav', ref: 'homeNav' },
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ href: '#/type/panda' },
									'全部'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ href: '#/type/热门竞技' },
									'热门竞技'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ href: '#/type/娱乐联盟' },
									'娱乐联盟'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ href: '#/type/主机游戏' },
									'主机游戏'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ href: '#/type/网游专区' },
									'网游专区'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ href: '#/type/手游专区' },
									'手游专区'
								)
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'home-list' },
						React.createElement(
							'ul',
							{ className: 'clearfix' },
							this.createHome()
						)
					)
				)
			);
		},
		componentDidMount: function componentDidMount() {
			var nav = this.refs.homeNav.getDOMNode();
			// $(nav).find('li').css("border-top-color","white");
			// 绑定事件委托
			$(nav).delegate('li', 'click', function (e) {
				$(e.target).parent().addClass('click').siblings().removeClass('click');
			});
		},
		componentDidUpdate: function componentDidUpdate() {
			var home = this.refs.home.getDOMNode();
			if (!this.state.signal) {
				$(home).animate({ marginLeft: "30px" }, 200);
			} else {
				$(home).animate({ marginLeft: "230px" }, 200);
			}
		}
	});
	// 应用程序组件
	var App = React.createClass({
		displayName: 'App',

		// 初始化状态数据
		getInitialState: function getInitialState() {
			return {
				list: []
			};
		},
		render: function render() {
			return React.createElement(
				'div',
				{ className: 'main' },
				React.createElement(Nav, { navData: this.props.navData }),
				React.createElement(ReactRouter.RouteHandler, { navData: this.props.navData })
			);
		},
		// 定义发送消息的方法
		sendAction: function sendAction() {
			// 渲染分类组件时候，我们需要发送消息的
			// 获取query
			var query = this.props.params.params.query;
			// 获取path
			var path = this.props.params.path;
			// 判断type页面
			if (path.indexOf('/type/') >= 0) {
				//  发送消息
				HomeAction.changeType(query);
			}
		},
		// 组件创建完成，我们要发送消息
		componentDidMount: function componentDidMount() {
			this.sendAction();
		},
		// 组件更新，我们要发送消息
		componentDidUpdate: function componentDidUpdate() {
			this.sendAction();
		}
	});

	//  创建路由组件
	var Route = React.createFactory(ReactRouter.Route);
	// 默认路由组件
	var DefaultRoute = React.createFactory(ReactRouter.DefaultRoute);

	//  定义规则
	var routes = React.createElement(
		Route,
		{ path: '/', handler: App },
		React.createElement(Route, { path: '/type/:query', handler: Home }),
		React.createElement(DefaultRoute, { handler: Home })
	);
	// 通过异步请求获取数据
	$.get('data/sites.json', function (res) {
		if (res && res.errno === 0) {
			// 存储数据，加载图片
			DataBase = res;
			var laoderSpan = app.find('.loader-text span');
			laoderSpan.html('100.00');
			// 渲染组件
			//  启动路由渲染组件
			ReactRouter.run(routes, function (Handler, params) {
				// 可以根据Handler动态渲染页面，也可以将参数对象params传递进来
				React.render(React.createElement(Handler, { params: params, navData: DataBase }), app.get(0));
			});
		}
	});
})(jQuery, React, ReactRouter, Reflux);
/* 定义路由容器*/ /* 默认情况下渲染Home组件 */