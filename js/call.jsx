// Config
const config = {};
config.akPage = 'block-trumps-cabinet-www';
config.callCampaign = 'block-trumps-cabinet';
config.link = 'https://blocktrumpscabinet.com/';
config.prettyCampaignName = 'Block Trump\'s Cabinet';


// Modules
const React = require('react');
const ReactDOM = require('react-dom');

// Checking for outdated browsers
(function() {
    const isIE = /MSIE (\d+)\./.test(navigator.userAgent);
    if (isIE) {
        const version = +isIE[1];
        if (version < 10) {
            alert('Unfortunately your browser, Internet Explorer ' + version + ', is not supported.\nPlease visit the site with a modern browser like Firefox or Chrome.\nThanks!');
        }
    }

    if (/Android 2\.3/.test(navigator.userAgent)) {
        alert('Unfortunately your browser, Android 2.3, is not supported.\nPlease visit the site with a modern browser like Firefox or Chrome.\nThanks!');
    }
})();

// URLs
const urls = {};
urls.actionkit = 'https://act.demandprogress.org/act/';
urls.facebook = 'https://www.facebook.com/sharer.php?u=';
urls.feedback = 'https://dp-feedback-tool.herokuapp.com/api/v1/feedback?';
urls.twitter = 'https://twitter.com/intent/tweet?text=';

// State
const state = {};
state.isMobile = /mobile/i.test(navigator.userAgent);
state.isIE = /trident/i.test(navigator.userAgent);
state.query = getQueryVariables();

// Setup shortcuts for AJAX.
const ajax = {
    get: function(url, callback) {
        callback = callback || function() {};

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && callback) {
                callback(xhr.response);
            }
        };
        xhr.open('get', url, true);
        xhr.send();
    },

    post: function(url, formData, callback) {
        callback = callback || function() {};

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && callback) {
                callback(xhr.response);
            }
        };
        xhr.open('post', url, true);
        xhr.send(formData);
    },
};

function sendFormToActionKit(fields) {
    // iFrame
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.setAttribute('name', 'actionkit-iframe');
    document.body.appendChild(iframe);

    // Form
    const form = document.createElement('form');
    form.style.display = 'none';
    form.setAttribute('action', urls.actionkit);
    form.setAttribute('method', 'post');
    form.setAttribute('target', 'actionkit-iframe');

    Object.keys(fields).forEach(function(key) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
    });

    form.submit();
}

const events = {
    list: {},
    on: function(event, callback) {
        if (!this.list[event]) {
            this.list[event] = [];
        }

        this.list[event].push(callback);
    },
    trigger: function(event, data) {
        if (!this.list[event]) {
            return;
        }

        for (let i = 0; i < this.list[event].length; i++) {
            this.list[event][i](data);
        }
    },
};

function getQueryVariables() {
    const variables = {};

    const queryString = location.search.substr(1);
    const pairs = queryString.split('&');

    for (let i = 0; i < pairs.length; i++) {
        const keyValue = pairs[i].split('=');
        variables[keyValue[0]] = keyValue[1];
    }

    return variables;
}

function getSource() {
    const source = state.query.source || 'website';
    return source.toLowerCase();
}

function findPos(obj) {
    let curTop = 0;
    if (obj.offsetParent) {
        do {
            curTop += obj.offsetTop;
        } while (obj = obj.offsetParent);

        return [curTop];
    }
}

function k() {}

const Header = () => (
    <header>
        <div className="title">
            <span>Tell the Senate:</span>
            <br/>
            Block Trump’s Cabinet of Hate and Wall Street Greed
        </div>
    </header>
);

const EmailForm = React.createClass({
    render: function() {
        return (
            <div className="email-form">
                <div className="petition" id="petition">
                    <h3>Petition to members of the U.S. Senate:</h3>

                    Donald Trump’s first appointments to cabinet-level roles in his administration are horrifying. Trump nominees and rumored picks range from white nationalists and climate deniers to Wall Street insiders and corporate lobbyists.
                    <div className="spacer" />

                    As representatives of all Americans, you must stand up against hatred and greed. Fight to block and resist every Trump nominee who embraces racism, xenophobia, misogyny, homophobia, climate denial, and Wall Street greed.

                    <form onSubmit={ this.onSubmit } ref="form">
                        <input className="name" name="name" placeholder="Your name" autoFocus="autoFocus" />
                        <input className="email" name="email" placeholder="Email" type="email" />
                        <input className="zip" name="zip" placeholder="Zip code" type="tel" />
                        <button>
                            Sign the Petition
                        </button>
                    </form>

                    <div className="disclaimer">
                        We do not share your email address without your permission.
                        One or more partner groups
                        may send you updates on this and other important campaigns by email. If at any time you would like to unsubscribe from any of these email lists, you may do so.
                    </div>
                </div>

                <BodyCopy />

            </div>
        );
    },

    onSubmit: function(e) {
        e.preventDefault();

        const form = this.refs.form;

        const name = form.querySelector('[name="name"]');
        if (!name.value.trim()) {
            name.focus();
            alert('Please enter your name.');
            return;
        }

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const email = form.querySelector('[name="email"]');
        if (!email.value.trim()) {
            email.focus();
            alert('Please enter your email.');
            return;
        } else if (!emailRegex.test(email.value.trim())) {
            email.focus();
            alert('Please enter a valid email.');
            return;
        }

        const zip = form.querySelector('[name="zip"]');
        if (!zip.value.trim()) {
            zip.focus();
            alert('Please enter your zip.');
            return;
        }

        const fields = {
            'action_user_agent': navigator.userAgent,
            'country': 'United States',
            'email': email.value.trim(),
            'form_name': 'act-petition',
            'js': 1,
            'name': name.value.trim(),
            'opt_in': 1,
            'page': config.akPage,
            'source': getSource(),
            'want_progress': 1,
            'zip': zip.value.trim(),
        };

        sendFormToActionKit(fields);

        this.props.changeForm('phone');
    },
});

const PhoneForm = React.createClass({
    render: function() {
        return (
            <div>
                <div className="phone-form">
                    <form onSubmit={ this.onSubmit }>
                        <input placeholder="Your Phone Number" id="field-phone" ref="field-phone" className="phone" name="phone" autoComplete="on" pattern="[\d\(\)\-\+ ]*" autoFocus />
                        <button>
                            CLICK HERE TO CALL CLINTON'S TRANSITION TEAM
                            <img src="images/phone.svg" />
                        </button>
                    </form>

                    <div className="privacy">
                        This tool uses <a href="https://www.twilio.com/legal/privacy" target="_blank">Twilio</a>’s APIs.
                        <br />
                        If you prefer not to use our call tool, <a href="#opt-out" onClick={ this.onClickOptOut }>click here</a>.
                    </div>
                </div>

                <div
                    className="paragraph"
                    style={{
                        maxWidth: '860px',
                    }}
                >
                    Please enter your number above and we will give you a script and connect you to key members of Trump's transition team so you can tell them to make sure the administration doesn't hire corporate insiders.
                </div>
            </div>
        );
    },

    onSubmit: function(e) {
        e.preventDefault();

        const phoneField = this.refs['field-phone'];
        const number = phoneField.value.replace(/[^\d]/g, '');

        if (number.length !== 10) {
            phoneField.focus();
            return alert('Please enter your 10 digit phone number.');
        }

        const request = new XMLHttpRequest();
        const url = `https://dp-call-congress.herokuapp.com/create?db=cwd&campaignId=${config.callCampaign}&userPhone=${number}&source_id=${getSource()}`;
        request.open('GET', url, true);
        request.send();

        this.props.changeForm('script');
    },

    onClickOptOut: function(e) {
        e.preventDefault();

        this.props.changeForm('opt-out');
    },
});

const OptOutForm = React.createClass({
    numbers: {
        // 'The Office of the Treasury Secretary': '202-622-1100',
        // 'The Office of the White House Chief of Staff': '202-456-3737',
        // 'SEC Chair Mary Jo White': '202-551-2100',
        // 'SEC Commissioner Luis Aguilar': '202-551-2500',
        // 'SEC Commissioner Daniel Gallagher': '202-551-2600',
        // 'SEC Commissioner Kara Stein': '202-551-2800',
        // 'SEC Commissioner Michael Piwowar': '202-551-2700',
        // 'The Office of the SEC General Counsel': '202-551-5100',
        // 'The Domestic Policy Council': '202-456-5594',
        // 'The Office of Public Engagement': '202-456-1097',
        // 'The Office of the Press Secretary': '202-456-3282',
        // 'The White House General Counsel': '202-456-2632',
        // 'The Office of Management and Budget': '202-395-4840',
        // 'White House Operations': '202-456-2500',
        // 'The Domestic Policy Council': '202-456-6515',
        // 'The Office of Administration': '202-456-2861',
        // 'The Council of Economic Advisers': '202-395-5084',
        'Hillary Clinton\'s Campaign': '646-854-1432',
    },

    renderNumbers: function() {
        const numbers = [];

        for (let name in this.numbers) {
            let number = this.numbers[name];

            numbers.push(
                <div className="number">
                    <div className="name">
                        { name }
                    </div>

                    <div className="phone">
                        <a href={ 'tel:' + number }>{ number }</a>
                    </div>
                </div>
            );
        }

        return numbers;
    },

    render: function() {
        return (
            <div className="opt-out-form">
                <div className="script">
                    Tell them: <span className="suggestion">“I am calling because I want you to know how important it is that the people Donald Trump appoints to his administration care about the public interest &mdash; and are not just more Wall Street executives and other corporate insiders.”</span>
                </div>

                <div className="numbers">
                    { this.renderNumbers() }
                </div>
            </div>
        );
    },
});

const PhoneScript = React.createClass({
    onClickSendFeedback: function(e) {
        e.preventDefault();

        const data = {
            callCampaign: config.callCampaign,
            subject: 'Feedback from ' + (config.prettyCampaignName || config.callCampaign),
            text: '',
        };

        const fields = [
            document.querySelector('#who'),
            document.querySelector('#how'),
        ];

        fields.forEach(field => {
            data.text += `${field.name}:\n${field.value}\n\n`;
        });

        let url = urls.feedback;

        for (let key in data) {
            url += key;
            url += '=';
            url += encodeURIComponent(data[key]);
            url += '&';
        }

        ajax.get(url);

        this.setState({
            sent: true,
        });
    },

    getInitialState: function() {
        return {
            sent: false,
        };
    },

    render: function() {
        return (
            <div className="phone-script">
                <h2>Awesome. Making a few calls now will help us change the way the government runs for years to come.</h2>

                We are going to connect you to people have have power over who Trump will appoint to his administration. Some of them might be surprised to hear from you: They're not all used to getting calls from the public &mdash; even as they are making decisions RIGHT NOW that will affect the lives of millions of people.
                <div className="spacer" />

                Please be polite and say:
                <div className="spacer" />

                <div className="suggestion">
                    “I am calling because I want you to know how important it is that the people Donald Trump appoints to his administration care about the public interest &mdash; and are not just more Wall Street executives and other corporate insiders.”
                </div>
                <div className="spacer" />

                If you reach an answering machine, please leave a message. After each call is over, please hit the * key, and we will connect you to somebody else.

                <div className="calling-wrapper">
                    <h3>After your call(s), use the form to let us know how it went!</h3>
                    <form action="#" method="get" className={this.state.sent ? 'sent' : false}>
                        <div className="wrapper">
                            <h4>Who did you speak with?</h4>
                            <input required="required" type="text" name="Who did you speak with?" id="who" />
                            <h4>How did it go?</h4>
                            <input required="required" type="text" name="How did it go?" id="how" />
                            <br />
                            <div id="thanks">Thank you!</div>
                            <button onClick={this.onClickSendFeedback} type="submit" name="submit">Send Feedback</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    },
});

const Thanks = React.createClass({
    render: function() {
        return (
            <div className="thanks">
                Thanks for making your voice heard!
            </div>
        );
    },
});

const Form = React.createClass({
    render: function() {
        let form;
        switch (this.state.form) {
            case 'email':
            form = <EmailForm changeForm={ this.changeForm } />;
            break;

            case 'phone':
            form = <PhoneForm changeForm={ this.changeForm } />;
            break;

            case 'script':
            form = <PhoneScript />;
            break;

            case 'thanks':
            form = <Thanks />;
            break;

            case 'opt-out':
            form = <OptOutForm />;
            break;
        }

        return (
            <div className="form">
                { form }
            </div>
        );
    },

    getInitialState: function () {
        let form = 'email';

        if (state.query.call_tool) {
            form = 'phone';
        }

        if (getSource() === 'mpower') {
            form = 'phone';
        }

        if (state.query.debugState) {
            form = state.query.debugState;
        }

        return {
            form: form,
        };
    },

    changeForm: function(form) {
        this.setState({
            form: form,
        });

        const pos = findPos(this);
        scrollTo(0, pos - 16);
    },
});

const Organizations = React.createClass({
    render: function() {
        const organizations = [];
        for (let name in this.organizations) {
            organizations.push(
                <a
                    href={ this.organizations[name] }
                    target="_blank"
                    key={name}
                >
                    { name }
                </a>
            );
        }

        return (
            <div className="organizations">
                { organizations }
            </div>
        );
    },

    organizations: {
        'Demand Progress': 'https://demandprogress.org/',
        'Democracy For America': 'http://democracyforamerica.com/',
        'National People\'s Action': 'http://npa-us.org/',
        'Other 98': 'http://other98.com/',
        'RootsAction': 'http://www.rootsaction.org/',
        'Rootstrikers': 'http://www.rootstrikers.org/',
    },
});


const Contact = React.createClass({
    render: function() {
        return (
            <div className="contact">
                For press inquiries, please contact us at:
                <br />
                <a href="mailto:press@rootstrikers.org">press@rootstrikers.org</a>
            </div>
        );
    },
});

const CreativeCommons = React.createClass({
    render: function() {
        return (
            <div className="creative-commons">
                Trump photo (edited) via <a href="https://commons.wikimedia.org/wiki/File%3ADonald_Trump_(16493063167).jpg" target="_blank">Michael Vadon</a> under a <a href="http://creativecommons.org/licenses/by-sa/2.0" target="_blank">CC BY-SA 2.0</a> license.
                <br />
                Sessions photo (cropped) via <a href="https://commons.wikimedia.org/wiki/File%3AJeff_Sessions_by_Gage_Skidmore.jpg" target="_blank">Gage Skidmore</a> under a <a href="http://creativecommons.org/licenses/by-sa/3.0" target="_blank">CC BY-SA 3.0</a> license.
            </div>
        );
    },
});

const Social = React.createClass({
    render: function() {
        return (
            <div className="midnight-share-train">
                <div className="share">
                    <a onClick={this.onClickTwitter} target="_blank" href="#Share on Twitter" className="twitter">Tweet</a>
                    <a onClick={this.onClickFacebook} target="_blank" href="#Share on Facebook" className="facebook">Share</a>
                    <a target="_blank" href="#Share via Email" className="email">Email</a>
                </div>
            </div>
        );
    },

    onClickTwitter: function(e) {
        e.preventDefault();

        let shareText = document.querySelector('[name="twitter:description"]').content;

        const source = getSource();

        if (source) {
            shareText += '/?source=' + source;
        }

        const url = urls.twitter +
                  encodeURIComponent(shareText) +
                  '&ref=demandprogress';

        window.open(url);
    },

    onClickFacebook: function(e) {
        e.preventDefault();

        let url = urls.facebook + encodeURIComponent(config.link);

        const source = getSource();

        if (source) {
            url += '%3Fsource%3D' + source;
        }

        window.open(url);
    },
});

const BodyCopy = () => (
    <div className="paragraph">
        <hr />
        Trump rose to power with a divisive campaign that showed he was willing to embrace every fringe ideology from xenophobia to sexism to flat-out racism in order to gain power.

        <h3>Trump’s Broken Promises:</h3>
        Despite his campaign, Trump promised in election night to be “a president for all Americans.” But the parade of horribles that Trump has nominated to his administration show he is welcoming hate right into the White House.
        <div className="spacer" />
        And his pledge to “drain the swamp” and make Washington work for ordinary Americans instead of powerful elites? Forget about it. Trump’s cabinet is so pro-corporate it’s called “an investment banker’s dream.”
        <div className="spacer" />

        <h3>Who the Trump Cabinet Really Works For:</h3>
        Wall Street bankers and Trump’s corporate cronies are cheering the Trump agenda. It’s a corporate wish list that would eliminate protections for working people and our environment, and eviscerate strong rules reining in Wall Street.
        <div className="spacer" />
        The Trump administration is shaping up to benefit Donald Trump and his family’s business empire in a big way, with massive conflicts of interest posed by Trump’s continued stake in the Trump Organization.
        <div className="spacer" />

        <h3>The Senate Must Block and Resist Trump's Cabinet</h3>
        The U.S. Senate has confirmation power over most of Trump's cabinet. Senators must use this power to block and resist Trump’s cabinet of hate and greed. Consider who we’re talking about:
        <div className="spacer" />

        <div className="profiles">
            <div className="profile">
                <img src="images/Jeff_Sessions.jpg" alt="Jeff Sessions photo" />
                <strong>Jeff Sessions (Attorney General)</strong> – The same Jeff Sessions who was deemed too racist to confirm to a federal judgeship by a Republican Judiciary Committee in 1986 would be in charge of the Department of Justice. If confirmed, he would be responsible for enforcing the country’s civil rights laws, despite a history of calling a black subordinate "boy," "joking" about supporting the Ku Klux Klan, <a href="http://www.cnn.com/2016/11/17/politics/jeff-sessions-racism-allegations/index.html" target="_blank">and calling the ACLU and NAACP "un-American."</a>
            </div>
            <div className="spacer clear" />

            <div className="profile">
                <img style={{opacity: '0.4',}} src="images/Jeff_Sessions.jpg" alt="Jeff Sessions photo" />
                <strong>TBD A Wall Street insider as Treasury Secretary</strong> – TBD Donald Trump is reportedly choosing between Steve Mnuchin, an ex-Goldman Sachs executive who got rich kicking people out of their homes, foreclosing on 36,000 homes,[2] Jamie Dimon, the billionaire CEO of Wall Street giant JPMorgan,[3] and Rep. Jeb Hensarling, who has sought for years to roll back key protections against recklessness and greed on Wall Street, complaining that banks face "regulatory waterboarding."[4]
            </div>
            <div className="spacer clear" />

            <div className="profile">
                <img style={{opacity: '0.4',}} src="images/Jeff_Sessions.jpg" alt="Jeff Sessions photo" />
                <strong>Wilbur Ross (Secretary of Commerce)</strong> - Trump's reported pick to be Secretary of Commerce, Wilbur Ross, is a Wall Street billionaire who made his money as a notorious "vulture investor." The so-called "king of bankruptcy," <a href="http://www.thedailybeast.com/articles/2016/11/17/could-this-man-be-donald-trump-s-future-secretary-of-outsourcing.html" target="_blank">he offshored American textile jobs to China and Mexico</a> and <a href="http://www.huffingtonpost.com/entry/trump-wilbur-ross_us_582b4c04e4b01d8a014abacb" target="_blank">12 coal workers died at his mine in West Virginia.</a> But he complains that <a href="http://www.huffingtonpost.com/entry/trump-wilbur-ross_us_582b4c04e4b01d8a014abacb" target="_blank">“the 1 percent is being picked on for political reasons.”</a> Ross bailed out Donald Trump's failing casinos in Atlantic City, <a href="http://www.nytimes.com/2016/11/25/business/dealbook/wilbur-ross-commerce-secretary-donald-trump.html?ref=business&_r=0" target="_blank">buying himself a seat in Trump's crony cabinet.</a>
            </div>
            <div className="spacer clear" />
        </div>

        The Senate will be narrowly divided 52-48 between Republicans and Democrats in 2017 and many key Senate committees will be split 10-9 or 11-10. <strong>If Democrats stick together it could only take one or two principled Republican votes to block many of Trump’s nominees.</strong>
        <div className="spacer" />

        Donald Trump may have won the Electoral College, but members of the U.S. Senate should not give any support to Trump appointees espousing racism, xenophobia, misogyny, homophobia, climate denial, and corporate greed.
        <div className="spacer" />

        <a href="#petition" className="sign-the-petition">Sign the petition if you agree.</a>

    </div>
);

const CallPages = React.createClass({
    render: function() {
        return (
            <div className="wrapper">
                <Header />

                <Form />

                <Social />

                <Contact />

                <CreativeCommons />
            </div>
        );
    },

    imagesToPreload: [
        'images/phone.svg',
    ],

    componentDidMount: function() {
        for (let i = 0; i < this.imagesToPreload.length; i++) {
            const image = new Image();
            image.src = this.imagesToPreload[i];
        }
    },
});

ReactDOM.render(
    <CallPages />,
    document.querySelector('#app')
);

// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-74199344-7', 'auto');
ga('send', 'pageview');
