var _keystone = require('keystone');

module.exports = {

    post: function(schema, document, accolade) {

        // Production-level apps only
        if (process.env.NODE_ENV !== 'production')
            return;

        if(schema === undefined)
            throw "Slack plugin: A schema must be defined!";
        else if(document == undefined)
            throw "Slack plugin: A document reference must be defined!";
        else if(document.updatedBy == undefined)
            throw "Slack plugin: document.updatedBy not present; ensure 'track' option is enabled on the model caller.";

        var slack = _keystone.get('slack');
        var _ = require('underscore');
        var Sentencer = require('sentencer');
        var modelName = schema.tree.__t.default;

        // TODO: Pull from config
        var affirmatives = [
                            'certainly', 'absolutely', 'positively', 'most definitely',
                            'confidently', 'definitely', 'emphatically', 'categorically', 'with certainty', 'conclusively', 
                            'unquestionably', 'undoubtedly', 'indisputably', 'unmistakably', 'assuredly'
                           ];
        var accoladeInd = Math.floor(Math.random() * affirmatives.length);

        _keystone.list('User').model.findById(document.updatedBy, function(err, user) {

            slack.api('users.list', function(err, response) {

                var modelName = schema.tree.__t.default;

                // If there was a slack error, just return so the doc is saved
                if(err) {
                    next();
                    return;
                }

                if(response.ok) {
                    
                    // Get slack username given the keystone  user email
                    var slackUser = _.filter(response.members, function(member) {
                                        return _.some(member, {email: user.email});
                                    })[0];
                    var slackMsg = '<@' + slackUser.name + '> updated the ' + modelName + ' "' + document.name + '"!';

                    // Generate a random accolade?
                    if(accolade !== undefined && accolade !== false)
                        slackMsg += ' ' + Sentencer.make('<@' + slackUser.name + '>' + ' is ' + affirmatives[accoladeInd] + ' {{ an_adjective }} {{ noun }}!');

                    if(slackUser === undefined) {
                        next();
                        return;
                    }

                    // Send slack message
                    slack.webhook({

                          channel: slack.channel,
                          username: slack.user,  
                          icon_emoji: slack.user_icon,
                          text: slackMsg
                        },

                        function(err, response) {
                            if(err !== undefined)
                                console.error(err);
                        }

                    );
                }
            

            });

        });
    }

};