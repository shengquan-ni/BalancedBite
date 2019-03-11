package edu.uci.ics.balancedbite.web;

import org.eclipse.jetty.server.session.SessionHandler;

import edu.uci.ics.balancedbite.web.health.SampleHealthCheck;
import edu.uci.ics.balancedbite.web.resources.CheckSessionResource;
import edu.uci.ics.balancedbite.web.resources.SignInResource;
import edu.uci.ics.balancedbite.web.resources.SignUpResource;
import edu.uci.ics.balancedbite.web.resources.UserDataResource;
import edu.uci.ics.balancedbite.web.resources.testResource;
import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

public class balancedbiteApplication extends Application<balancedbiteConfiguration> {

    public static void main(final String[] args) throws Exception {
        new balancedbiteApplication().run(args);
    }

    @Override
    public String getName() {
        return "balancedbite";
    }

    @Override
    public void initialize(final Bootstrap<balancedbiteConfiguration> bootstrap) {
        // TODO: application initialization
    }

    @Override
    public void run(final balancedbiteConfiguration configuration,
                    final Environment environment) {

        // resources
    	
    	final SignInResource signInResource = new SignInResource(
    				configuration.getDatabaseConfiguration().getHost(),
    				configuration.getDatabaseConfiguration().getPort()
    			);
    	
    	final SignUpResource signUpResource = new SignUpResource(
    				configuration.getDatabaseConfiguration().getHost(),
    				configuration.getDatabaseConfiguration().getPort()
    			);
    	
    	final CheckSessionResource checkSessionResource = new CheckSessionResource(
    				configuration.getDatabaseConfiguration().getHost(),
    				configuration.getDatabaseConfiguration().getPort()
    			);
    	
    	final UserDataResource userDataResource = new UserDataResource(
    				configuration.getDatabaseConfiguration().getHost(),
    				configuration.getDatabaseConfiguration().getPort()
    			);

    	environment.jersey().register(signInResource);
    	environment.jersey().register(signUpResource);
    	environment.jersey().register(checkSessionResource);
    	environment.jersey().register(userDataResource);
    	
    	// health checks
    	final SampleHealthCheck sampleHealthCheck = new SampleHealthCheck();
    	environment.healthChecks().register("sampleHealthCheck", sampleHealthCheck);    	
    	
    }

}
