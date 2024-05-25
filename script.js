const open = document.querySelector('.container');
		const close = document.querySelector('.close');
		var tl = gsap.timeline({ defaults: { duration: 1, ease: 'expo.inOut' } });
		open.addEventListener('click', () => {
			if (tl.reversed()) {
				tl.play();
			} else {
				tl.to('nav', { right: 0 })
					.to('nav', { height: '100vh' }, '-=.1')
					.to('nav ul li a', { opacity: 1, pointerEvents: 'all', stagger: .2 }, '-=.8')
					.to('.close', { opacity: 1, pointerEvents: 'all' }, "-=.8")
					.to('nav h2', { opacity: 1 }, '-=1');
			}
		});

		close.addEventListener('click', () => {
			tl.reverse();
		});


/*document.getElementById("teagithub").addEventListener("click", function() {
	window.location.href = "https://github.com/natesworks/tea"; 
});

document.getElementById("fluxgithub").addEventListener("click", function() {
	window.location.href = "https://github.com/natesworks/flux"; 
});
*/

document.getElementById("swiftosgithub").addEventListener("click", function() {
	window.location.href = "https://github.com/teamswiftos/swiftos"; 
});

document.getElementById("swiftosdiscord").addEventListener("click", function() {
	window.location.href = "https://discord.gg/RBEnjSVQ8N"; 
});