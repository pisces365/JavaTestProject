package com.jflyfox.util.anotation;

import com.jfinal.plugin.activerecord.Model;
import com.jflyfox.util.annotation.ClassSearcher;
import junit.framework.TestCase;
import org.easymock.EasyMock;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ClassSearchTest extends TestCase {
    private ClassSearcher classSearcher;
    private Class<?> clazz;
    private List<String> includeJars;

    @Before
    public void setUp() throws Exception{
        classSearcher = new ClassSearcher();
        clazz = Model.class;
        includeJars = new ArrayList<>();

    }
    @After
    public void tearDown() throws Exception{

    }
    @Test
    public void testFindInClasspathAndJars(){
        assertEquals("[]", classSearcher.findInClasspathAndJars(clazz, includeJars));

    }
}
